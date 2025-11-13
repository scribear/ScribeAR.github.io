import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import makeWhisper from './libstream';
import { loadRemoteWithFallbacks } from './indexedDB';
import { SIPOAudioBuffer } from './sipo-audio-buffer';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import WavDecoder from 'wav-decoder';

type ModelKey = 'tiny-en-q5_1' | 'tiny-q5_1';

// concat helper
function Float32Concat(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

// Build all plausible URLs where the model might live
function resolveModelUrls(filename: string): string[] {
  const pub = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const origin = window.location.origin;
  const curPath = window.location.pathname.replace(/\/$/, '');
  return [
    `${pub}/models/${filename}`,
    `${origin}${pub}/models/${filename}`,
    `/models/${filename}`,
    `${origin}/models/${filename}`,
    `${curPath}/models/${filename}`,
  ];
}

export class WhisperRecognizer implements Recognizer {
  private kSampleRate = 16000;
  private kWindowLength = 5;   // sec
  private kChunkLength = 128;  // samples

  private context: AudioContext;
  private audio_buffer: SIPOAudioBuffer;
  private recorder?: RecordRTC;

  private whisper: any = null;
  private model_name: ModelKey = 'tiny-en-q5_1';
  private model_index = -1;

  /**
   * language semantics:
   *  - 'zh'  -> assume Chinese speech; translate -> English
   *  - 'en'  -> assume English; transcribe -> English (no translation flag)
   *  - 'auto'-> enable detect_language in wrapper; transcribe in detected language
   *  - others (e.g., 'ja','ko',...) -> transcribe in that language
   */
  private language = 'en';
  private num_threads: number;

  private transcribed_callback:
    ((finalBlocks: Array<TranscriptBlock>, inProg: TranscriptBlock) => void) | null = null;

  constructor(
    _audioSource: any,
    language: string,
    num_threads: number = 4,
    model: ModelKey = 'tiny-en-q5_1'
  ) {
    this.num_threads = num_threads;
    this.language    = language || 'en';
    this.model_name  = model;

    const num_chunks = (this.kWindowLength * this.kSampleRate) / this.kChunkLength;
    this.audio_buffer = new SIPOAudioBuffer(num_chunks, this.kChunkLength);

    this.context = new AudioContext({ sampleRate: this.kSampleRate });

    // Warn if English-only model is used for non-English scenarios
    if (this.model_name === 'tiny-en-q5_1' && this.language !== 'en') {
      console.warn(
        '[Whisper] Non-English scenario requested with tiny-en model. ' +
        'Use the multilingual model (tiny-q5_1) for best results.'
      );
    }
  }

  /** Centralized application of language/translate/task flags to the WASM wrapper */
  private applyLanguageSettings = () => {
    if (!this.whisper || this.model_index < 0) return;

    // Decide behavior
    const isAuto = this.language === 'auto';
    const shouldTranslateToEnglish = (this.language === 'zh'); // <— core requirement

    try {
      // Auto-detect if 'auto', otherwise pin the language
      this.whisper.set_detect_language?.(this.model_index, isAuto ? 1 : 0);
      if (!isAuto) {
        this.whisper.set_language?.(this.model_index, this.language);
      }

      // Translate only for Chinese -> English; otherwise transcribe in source language
      this.whisper.set_translate?.(this.model_index, shouldTranslateToEnglish ? 1 : 0);

      // If wrapper exposes task, 0=transcribe, 1=translate (common whisper.cpp bindings)
      this.whisper.set_task?.(this.model_index, shouldTranslateToEnglish ? 1 : 0);

      // Optional: threads if supported by wrapper
      this.whisper.set_threads?.(this.model_index, this.num_threads);
    } catch (e) {
      // optional methods may not exist in some builds
      // tslint:disable-next-line:no-console
      console.debug('[Whisper] applyLanguageSettings (some setters may be missing):', e);
    }
  };

  /** Allow runtime language change (e.g., UI dropdown) */
  public setLanguage = (lang: string) => {
    if (!lang) return;
    // Normalize common variants to 2-letter codes whisper.cpp expects
    const base = (lang.toLowerCase().match(/[a-z]+/) || ['en'])[0];
    // keep 'zh' and 'en' explicit; allow 'auto'
    const code = base === 'zh' ? 'zh' : base === 'en' ? 'en' : (base === 'auto' ? 'auto' : base);

    this.language = code;
    console.log('[Whisper] setLanguage ->', this.language);

    this.applyLanguageSettings();
  };

  private print = (text: string) => {
    if (this.transcribed_callback) {
      const block = new TranscriptBlock();
      block.text = text;
      this.transcribed_callback([block], new TranscriptBlock());
    }
  };
  private printDebug = (t: string) => console.log(t);

  private storeFS(fname: string, buf: Uint8Array) {
    try { this.whisper.FS_unlink(fname); } catch {}
    this.whisper.FS_createDataFile('/', fname, buf, true, true);
    this.printDebug('storeFS: stored model: ' + fname + ' size: ' + buf.length);
  }

  private async load_model(model: ModelKey) {
    // Be resilient to common filename variants
    const fileCandidates: Record<ModelKey, string[]> = {
      'tiny-en-q5_1': [
        'ggml-model-whisper-tiny.en-q5_1.bin',
        'ggml-tiny.en-q5_1.bin'
      ],
      'tiny-q5_1': [
        'ggml-model-whisper-tiny-q5_1.bin',
        'ggml-tiny-q5_1.bin'
      ],
    };
    const sizes: Record<ModelKey,number> = { 'tiny-en-q5_1': 31, 'tiny-q5_1': 31 };

    const names = fileCandidates[model] || [];
    const candidates = names.flatMap(n => resolveModelUrls(n));
    const dst = 'whisper.bin';
    const size_mb = sizes[model];

    return new Promise<void>((resolve, reject) => {
      loadRemoteWithFallbacks(
        candidates,
        dst,
        size_mb,
        (_p) => {},
        (fname, buf) => {
          if (!(buf && buf.length > 4096)) {
            this.printDebug('load_model: fetched buffer too small (' + (buf ? buf.length : 0) + ')');
            reject('model-bytes-too-small');
            return;
          }
          this.storeFS(fname, buf);
          resolve();
        },
        () => reject('load-cancel'),
        this.printDebug
      );
    });
  }

  public async loadWhisper() {
    this.whisper = await makeWhisper({
      print: this.print,
      printErr: this.printDebug,
      setStatus: (t: string) => this.printDebug('js: ' + t),
      monitorRunDependencies: function (_left: number) {}
    });

    await this.load_model(this.model_name);

    // Initialize the model in WASM FS
    this.model_index = this.whisper.init('whisper.bin');

    // Apply language/translate/task config
    this.applyLanguageSettings();

    console.log('[Whisper] initialized with language =', this.language, 'model =', this.model_name);

    // Microphone
    const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    let last_suffix = new Float32Array(0);
    this.recorder = new RecordRTC(mic, {
      type: 'audio',
      mimeType: 'audio/wav',
      desiredSampRate: this.kSampleRate,
      timeSlice: 250,
      ondataavailable: async (blob: Blob) => {
        const ab = await blob.arrayBuffer();
        const decoded = await WavDecoder.decode(ab);
        let pcm = decoded.channelData[0]; // mono

        pcm = Float32Concat(last_suffix, pcm);
        last_suffix = pcm.slice(-(pcm.length % this.kChunkLength));

        for (let i = 0; i <= pcm.length - this.kChunkLength; i += this.kChunkLength) {
          this.process_recorder_message(pcm.subarray(i, i + this.kChunkLength));
        }
      },
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
    });

    this.recorder.startRecording();
    this.printDebug('Whisper: audio recorder started');
  }

  private process_recorder_message(audio_chunk: Float32Array) {
    this.audio_buffer.push(audio_chunk);
    if (this.audio_buffer.isFull()) {
      this.whisper.set_audio(this.model_index, this.audio_buffer.getAll());
      this.audio_buffer.clear();
    }
  }

  start() {
    this.printDebug('trying to start whisper');
    if (!this.whisper || this.model_index === -1) {
      this.loadWhisper()
        .then(() => { this.whisper.setStatus?.(''); this.context.resume(); })
        .catch(e => this.printDebug('loadWhisper failed: ' + e));
    } else {
      this.whisper.setStatus?.('');
      this.context.resume();
    }
  }

  stop() {
    if (!this.whisper || this.model_index === -1) return;
    try { this.whisper.set_status?.('paused'); } catch {}
    this.context.suspend();
    this.recorder?.stopRecording();
  }

  onTranscribed(cb: (finalBlocks: Array<TranscriptBlock>, inProg: TranscriptBlock) => void) {
    this.transcribed_callback = cb;
  }
  onError(_cb: (e: Error) => void) {}
}
