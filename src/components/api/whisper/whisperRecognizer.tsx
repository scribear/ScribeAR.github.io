// src/components/api/whisper/whisperRecognizer.tsx

import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import makeWhisper from './libstream';
import { loadRemoteWithFallbacks } from './indexedDB';
import { SIPOAudioBuffer } from './sipo-audio-buffer';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import WavDecoder from 'wav-decoder';

// Base URL for model binaries.
// You can override this with REACT_APP_WEBMODELS_BASE_URL if needed.
const WEBMODEL_BASE_URL: string =
  (process.env.REACT_APP_WEBMODELS_BASE_URL as string | undefined) ??
  'https://raw.githubusercontent.com/scribear/webmodels/main/data/';

// https://stackoverflow.com/questions/4554252/typed-arrays-in-gecko-2-float32array-concatenation-and-expansion
function Float32Concat(first: Float32Array, second: Float32Array): Float32Array {
  const firstLength = first.length;
  const result = new Float32Array(firstLength + second.length);
  result.set(first);
  result.set(second, firstLength);
  return result;
}

/**
 * Wrapper for Web Assembly implementation of whisper.cpp
 */
export class WhisperRecognizer implements Recognizer {
  //
  // Audio params
  //
  // Whisper expects 16kHz mono PCM
  private kSampleRate = 16000;

  // Length of the suffix of the captured audio that whisper processes each time (in seconds)
  private kWindowLength = 5;

  // Number of samples in each audio chunk the recorder gives us
  private kChunkLength = 128;

  /**
   * Audio context and buffer used to capture speech
   */
  private context: AudioContext;
  private audio_buffer: SIPOAudioBuffer;
  private recorder?: RecordRTC;

  /**
   * Instance of the whisper wasm module, and its variables
   */
  private whisper: any = null;
  private model_name: string = '';
  private model_index: number = -1;
  private language: string = 'en';
  private num_threads: number;

  private transcribed_callback:
    | ((newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void)
    | null = null;

  /**
   * Creates an Whisper recognizer instance that listens to the default microphone
   * and expects speech in the given language
   *
   * @param audioSource Not implemented yet
   * @param language Language code for whisper (e.g. "en")
   * @param num_threads Number of worker threads that whisper uses
   * @param model Whisper model key (e.g. "tiny-en-q5_1", "tiny-q5_1", "tiny-multi")
   */
  constructor(
    audioSource: any,
    language: string,
    num_threads: number = 4,
    model: string = 'tiny-en-q5_1',
  ) {
    this.num_threads = num_threads;
    this.language = language;
    this.model_name = model;

    const num_chunks = (this.kWindowLength * this.kSampleRate) / this.kChunkLength;
    this.audio_buffer = new SIPOAudioBuffer(num_chunks, this.kChunkLength);

    this.context = new AudioContext({
      sampleRate: this.kSampleRate,
    });
  }

  private print = (text: string) => {
    if (this.transcribed_callback != null) {
      const block = new TranscriptBlock();
      block.text = text;
      this.transcribed_callback([block], new TranscriptBlock());
    }
  };

  private printDebug = (text: string) => {
    console.log(text);
  };

  private isEnglishOnlyModel(): boolean {
    // Whisper model keys containing "-en" or ending with ".en" are English-only.
    return this.model_name.includes('-en') || this.model_name.endsWith('.en');
  }

  // Try multiple setter name shapes to match whatever the wasm build exported.
  private trySetter(names: string[], ...args: any[]): boolean {
    for (const n of names) {
      const fn = (this.whisper as any)?.[n];
      if (typeof fn === 'function') {
        try {
          fn.apply(this.whisper, args);
          return true;
        } catch (e) {
          console.debug(`Whisper: setter ${n} threw`, e);
        }
      }
    }
    return false;
  }

  /** Apply language/translation/thread settings to the wasm instance (best-effort). */
  private applyLanguageSettings() {
    if (!this.whisper || this.model_index < 0) return;

    const lang = this.language || 'en';
    // If model is multilingual and language is still 'en', prefer auto-detect.
    const detect =
      lang === 'auto' || (!this.isEnglishOnlyModel() && lang === 'en') ? 1 : 0;

    // language / detect
    this.trySetter(['set_detect_language', 'setDetectLanguage'], this.model_index, detect ? 1 : 0);
    if (!detect) {
      this.trySetter(['set_language', 'setLanguage'], this.model_index, lang);
    }

    // Force transcribe (task 0) and translate disabled
    const translateSet =
      this.trySetter(['set_translate', 'setTranslate'], this.model_index, 0) ||
      this.trySetter(['set_translate', 'setTranslate'], this.model_index, false);
    const taskSet = this.trySetter(['set_task', 'setTask'], this.model_index, 0);

    // Threads if supported
    this.trySetter(['set_threads', 'setThreads'], this.model_index, this.num_threads);

    if (!translateSet || !taskSet) {
      console.debug('Whisper: translate/task setters not found; build may default to translate=true');
    }
  }

  /** Allow runtime language updates if control language changes. */
  public setLanguage(language: string) {
    if (!language) return;
    this.language = language;
    this.applyLanguageSettings();
  }

  private storeFS(fname: string, buf: Uint8Array) {
    // write to WASM file using FS_createDataFile
    // if the file exists, delete it
    try {
      this.whisper.FS_unlink(fname);
    } catch (e) {
      // ignore
    }
    this.whisper.FS_createDataFile('/', fname, buf, true, true);
    this.printDebug('storeFS: stored model: ' + fname + ' size: ' + buf.length);
  }

  /**
   * Async load the WASM module, ggml model, and Audio Worklet needed for whisper to work
   */
  public async loadWhisper() {
    // Load wasm and ggml
    this.whisper = await makeWhisper({
      print: this.print,
      printErr: this.printDebug,
      setStatus: (text: string) => {
        this.printDebug('js: ' + text);
      },
      monitorRunDependencies: (_left: number) => {},
    });

    await this.load_model(this.model_name);

    this.model_index = this.whisper.init('whisper.bin');
    console.log('Whisper: Done instantiating whisper', this.whisper, this.model_index);
    this.applyLanguageSettings();

    // Set up audio source
    const mic_stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    let last_suffix = new Float32Array(0);

    this.recorder = new RecordRTC(mic_stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      desiredSampRate: this.kSampleRate,
      timeSlice: 250,
      ondataavailable: async (blob: Blob) => {
        // Convert wav chunk to PCM
        const array_buffer = await blob.arrayBuffer();
        const { channelData } = await WavDecoder.decode(array_buffer);

        // Should be 16k, float32, stereo pcm data
        // Just get 1 channel
        let pcm_data = channelData[0];

        // Prepend previous suffix and update with current suffix
        pcm_data = Float32Concat(last_suffix, pcm_data);
        last_suffix = pcm_data.slice(-(pcm_data.length % this.kChunkLength));

        // Feed process_recorder_message audio in kChunkLength sample chunks
        for (let i = 0; i + this.kChunkLength <= pcm_data.length; i += this.kChunkLength) {
          const audio_chunk = pcm_data.subarray(i, i + this.kChunkLength);
          this.process_recorder_message(audio_chunk);
        }
      },
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
    });

    this.recorder.startRecording();
    console.log('Whisper: Done setting up audio context');
  }

  private async load_model(model: string) {
    const urls: Record<string, string> = {
      // Prefer the filenames that actually exist in webmodels/; we add
      // whisper-prefixed variants as fallbacks below.
      // Prefer q5_1 variants we actually host; fallbacks add other name shapes.
      'tiny.en': 'ggml-tiny.en-q5_1.bin',
      tiny: 'ggml-tiny-q5_1.bin',
      'base.en': 'ggml-base.en-q5_1.bin',
      base: 'ggml-base-q5_1.bin',
      'small.en': 'ggml-small.en-q5_1.bin',
      small: 'ggml-small-q5_1.bin',

      'tiny-en-q5_1': 'ggml-tiny.en-q5_1.bin',
      'tiny-q5_1': 'ggml-tiny-q5_1.bin',

      // multilingual tiny aliases
      'tiny-multi': 'ggml-tiny-q5_1.bin',
      'tiny-multi-q5_1': 'ggml-tiny-q5_1.bin',

      'base-en-q5_1': 'ggml-base.en-q5_1.bin',
      'base-q5_1': 'ggml-base-q5_1.bin',
      'small-en-q5_1': 'ggml-small.en-q5_1.bin',
      'small-q5_1': 'ggml-small-q5_1.bin',
      'medium-en-q5_0': 'ggml-medium.en-q5_0.bin',
      'medium-q5_0': 'ggml-medium-q5_0.bin',
      'large-q5_0': 'ggml-large-q5_0.bin',
    };

    const sizes: Record<string, number> = {
      'tiny.en': 75,
      tiny: 75,
      'base.en': 142,
      base: 142,
      'small.en': 466,
      small: 466,

      'tiny-en-q5_1': 31,
      'tiny-q5_1': 31,
      'tiny-multi': 31,
      'tiny-multi-q5_1': 31,

      'base-en-q5_1': 57,
      'base-q5_1': 57,
      'small-en-q5_1': 182,
      'small-q5_1': 182,
      'medium-en-q5_0': 515,
      'medium-q5_0': 515,
      'large-q5_0': 1030,
    };

    const filename = urls[model];

    if (!filename) {
      this.printDebug(`Whisper: unknown model key "${model}", falling back to "tiny-en-q5_1"`);
      this.model_name = 'tiny-en-q5_1';
      return this.load_model(this.model_name);
    }

    const size_mb = sizes[model] ?? 0;
    const dst = 'whisper.bin';

    const buildUrls = (fname: string): string[] => {
      const variants = new Set<string>();

      // 1) canonical
      variants.add(fname);

      // 2) add whisper-prefixed variant if not already present
      if (!fname.includes('model-whisper-')) {
        const withWhisper = fname.replace('ggml-', 'ggml-model-whisper-');
        variants.add(withWhisper);
      }

      // 3) add plain ggml variant (in case fname carried the whisper prefix)
      if (fname.includes('model-whisper-')) {
        const plain = fname.replace('ggml-model-whisper-', 'ggml-');
        variants.add(plain);
      }

      const base = WEBMODEL_BASE_URL.endsWith('/')
        ? WEBMODEL_BASE_URL.slice(0, -1)
        : WEBMODEL_BASE_URL;

      return Array.from(variants).map((v) => `${base}/${v}`);
    };

    const urlsToTry = buildUrls(filename);

    const that = this;

    return new Promise<void>((resolve, reject) => {
      loadRemoteWithFallbacks(
        urlsToTry,
        dst,
        size_mb,
        (_text: string) => {},
        (fname: string, buf: Uint8Array) => {
          that.storeFS(fname, buf);
          resolve();
        },
        () => {
          reject();
        },
        that.printDebug,
      );
    });
  }

  /**
   * Helper method that stores audio chunks from the raw recorder in buffer
   * @param audio_chunk Float32Array containing an audio chunk
   */
  private process_recorder_message(audio_chunk: Float32Array) {
    this.audio_buffer.push(audio_chunk);

    if (this.audio_buffer.isFull()) {
      this.whisper.set_audio(this.model_index, this.audio_buffer.getAll());
      this.audio_buffer.clear();
    }
  }

  // Placeholder – we don't currently use analyzer features
  private process_analyzer_result(_features: any) {}

  /**
   * Makes the Whisper recognizer start transcribing speech, if not already started
   * Throws exception if recognizer fails to start
   */
  start() {
    console.log('trying to start whisper');

    if (this.whisper == null || this.model_index === -1) {
      this.loadWhisper().then(() => {
        this.whisper.setStatus('');
        this.context.resume();
      });
    } else {
      this.whisper.setStatus('');
      this.context.resume();
    }
  }

  /**
   * Makes the Whisper recognizer stop transcribing speech asynchronously
   * Throws exception if recognizer fails to stop
   */
  stop() {
    if (this.whisper == null || this.model_index === -1) {
      return;
    }
    this.whisper.set_status('paused');
    this.context.suspend();
    this.recorder?.stopRecording();
  }

  /**
   * Subscribe a callback function to the transcript update event, which is usually triggered
   * when the recognizer has processed more speech or finalized some in-progress part
   * @param callback A callback function called with updates to the transcript
   */
  onTranscribed(
    callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void,
  ) {
    this.transcribed_callback = callback;
  }

  /**
   * Subscribe a callback function to the error event, which is triggered
   * when the recognizer has encountered an error
   * @param callback A callback function called with the error object when the event is triggered
   */
  onError(_callback: (e: Error) => void) {
    // TODO: wire up whisper error channel if/when libstream exposes one
  }
}
