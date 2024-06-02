import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import makeWhisper from './libmain';
import { string } from 'mathjs';
import { loadRemote } from './indexedDB'

const kMaxAudio_s = 30*60;
const kMaxRecording_s = 5;
const kSampleRate = 16000;

/**
 * Wrapper for Web Assembly implementation of whisper.cpp
 */
export class WhisperRecognizer implements Recognizer {

    private language: string = "en";
    private whisper: any;
    private transcript: string = "";
    private instance: any;
    private num_threads: number;
    private chunks: any[] = [];

    private context: AudioContext;
    private stream: any;
    private mediaRecorder: any;
    private audio: any;

    private doRecording: boolean = false;
    private startTime: number = 0;

    /**
     * Creates an Whisper recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Not implemented yet
     * @parem num_threads Number of worker threads that whisper uses
     */
    constructor(audioSource: any, language: string, num_threads: number = 4) {
        this.num_threads = num_threads;
        this.context = new AudioContext({
            sampleRate: kSampleRate,
        });
    }

    private print = (text: string) => {
        this.transcript += string + "\n";
        console.warn(text);
    }

    /**
     * Load the Whisper wasm module asynchronously 
     */
    async load_whisper() {
        if (this.whisper === undefined) {
            this.whisper = await makeWhisper({
                print: this.print,
                printErr: this.print,
                setStatus: function(text) {
                    this.print('js: ' + text);
                },
                monitorRunDependencies: function(left) {
                }
            });
        }
        this.load_model("tiny.en")
    }

    private storeFS(fname, buf) {
        // write to WASM file using FS_createDataFile
        // if the file exists, delete it
        try {
            this.whisper.FS_unlink(fname);
        } catch (e) {
            // ignore
        }
        this.whisper.FS_createDataFile("/", fname, buf, true, true);
        this.print('storeFS: stored model: ' + fname + ' size: ' + buf.length);
    }

    private async load_model(model: string) {
        let urls = {
            'tiny.en':  'https://whisper.ggerganov.com/ggml-model-whisper-tiny.en.bin',
            'tiny':     'https://whisper.ggerganov.com/ggml-model-whisper-tiny.bin',
            'base.en':  'https://whisper.ggerganov.com/ggml-model-whisper-base.en.bin',
            'base':     'https://whisper.ggerganov.com/ggml-model-whisper-base.bin',
            'small.en': 'https://whisper.ggerganov.com/ggml-model-whisper-small.en.bin',
            'small':    'https://whisper.ggerganov.com/ggml-model-whisper-small.bin',

            'tiny-en-q5_1':  'https://whisper.ggerganov.com/ggml-model-whisper-tiny.en-q5_1.bin',
            'tiny-q5_1':     'https://whisper.ggerganov.com/ggml-model-whisper-tiny-q5_1.bin',
            'base-en-q5_1':  'https://whisper.ggerganov.com/ggml-model-whisper-base.en-q5_1.bin',
            'base-q5_1':     'https://whisper.ggerganov.com/ggml-model-whisper-base-q5_1.bin',
            'small-en-q5_1': 'https://whisper.ggerganov.com/ggml-model-whisper-small.en-q5_1.bin',
            'small-q5_1':    'https://whisper.ggerganov.com/ggml-model-whisper-small-q5_1.bin',
            'medium-en-q5_0':'https://whisper.ggerganov.com/ggml-model-whisper-medium.en-q5_0.bin',
            'medium-q5_0':   'https://whisper.ggerganov.com/ggml-model-whisper-medium-q5_0.bin',
            'large-q5_0':    'https://whisper.ggerganov.com/ggml-model-whisper-large-q5_0.bin',
        };
        let sizes = {
            'tiny.en':  75,
            'tiny':     75,
            'base.en':  142,
            'base':     142,
            'small.en': 466,
            'small':    466,

            'tiny-en-q5_1':   31,
            'tiny-q5_1':      31,
            'base-en-q5_1':   57,
            'base-q5_1':      57,
            'small-en-q5_1':  182,
            'small-q5_1':     182,
            'medium-en-q5_0': 515,
            'medium-q5_0':    515,
            'large-q5_0':     1030,
        };

        let url     = urls[model];
        let dst     = 'whisper.bin';
        let size_mb = sizes[model];
        loadRemote(url, dst, size_mb, (text) => {}, this.storeFS.bind(this), this.print, this.print);
    }

    /**
     * Makes the Whisper recognizer start transcribing speech, if not already started
     * Throws exception if recognizer fails to start
     */
    start() {
        let that = this;
        that.doRecording = true;
        that.startTime = Date.now();

        navigator.mediaDevices.getUserMedia({audio: true, video: false})
            .then(function(s) {
                that.stream = s;
                that.mediaRecorder = new MediaRecorder(that.stream);
                that.mediaRecorder.ondataavailable = function(e) {
                    that.chunks.push(e.data);
                };
                that.mediaRecorder.onstop = function(e) {
                    let blob = new Blob(that.chunks, { 'type' : 'audio/ogg; codecs=opus' });
                    that.chunks = [];

                    let reader = new FileReader();
                    reader.onload = function(event) {
                        var buf = new Uint8Array(reader.result as ArrayBuffer); // HACK: casting to keep typescript happy

                        that.context.decodeAudioData(buf.buffer, function(audioBuffer) {
                            var offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
                            var source = offlineContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(offlineContext.destination);
                            source.start(0);

                            offlineContext.startRendering().then(function(renderedBuffer) {
                                that.audio = renderedBuffer.getChannelData(0);
                                that.print('js: audio recorded, size: ' + that.audio.length);

                                // truncate to first 30 seconds
                                if (that.audio.length > kMaxRecording_s*kSampleRate) {
                                    that.audio = that.audio.slice(0, kMaxRecording_s*kSampleRate);
                                    that.print('js: truncated audio to first ' + kMaxRecording_s + ' seconds');
                                }
                                that.process(false);
                            });
                        }, function(e) {
                            that.print('js: error decoding audio: ' + e);
                            that.audio = null;
                        });
                    }
                    reader.readAsArrayBuffer(blob);
                };
                that.mediaRecorder.start();
            })
            .catch(function(err) {
                that.print('js: error getting audio stream: ' + err);
            });

        var interval = setInterval(function() {
            if (!that.doRecording) {
                clearInterval(interval);
                that.mediaRecorder.stop();
                that.stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }
        }, 1000);

        this.print('js: recording ...');

        setTimeout(function() {
            if (that.doRecording) {
                that.print('js: recording stopped after ' + kMaxRecording_s + ' seconds');
                that.stop();
            }
        }, kMaxRecording_s*1000);
    }

    /**
     * Makes the Whisper recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        this.doRecording = false;
    }

    private process(translate : boolean = false) {
        if (!this.instance) {
            this.instance = this.whisper.init('whisper.bin');

            if (this.instance) {
                this.print("js: whisper initialized, instance: " + this.instance);
            }
        }

        if (!this.instance) {
            this.print("js: failed to initialize whisper");
            return;
        }

        if (!this.audio) {
            this.print("js: no audio data");
            return;
        }

        if (this.instance) {
            this.print('');
            this.print('js: processing - this might take a while ...');
            this.print('');

            let that = this
            setTimeout(function() {
                var ret = that.whisper.full_default(that.instance, that.audio, that.language, that.num_threads, translate);
                console.log('js: full_default returned: ' + ret);
                if (ret) {
                    that.print("js: whisper returned: " + ret);
                }
            }, 100);
        }
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech or finalized some in-progress part
     * @param callback A callback function called with updates to the transcript
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        
    }

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void) {
        
    }

}

