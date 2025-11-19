import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import { ScribearServerStatus, STATUS } from '../../../react-redux&middleware/redux/typesImports';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { store } from '../../../store'
import { setModelOptions, setSelectedModel } from '../../../react-redux&middleware/redux/reducers/modelSelectionReducers';
import type { SelectedOption } from '../../../react-redux&middleware/redux/types/modelSelection';


enum BackendTranscriptBlockType {
    Final = 0,
    InProgress = 1,
}

type BackendTranscriptBlock = {
    type: BackendTranscriptBlockType;
    start: number;
    end: number;
    text: string;
};



export class ScribearRecognizer implements Recognizer {
    private scribearServerStatus: ScribearServerStatus
    private selectedModelOption: SelectedOption
    private socket: WebSocket | null = null
    private ready = false;
    private transcribedCallback: any
    private errorCallback?: (e: Error) => void;
    private language: string
    private recorder?: RecordRTC;
    private kSampleRate = 16000;
    // last time we received an audio chunk (ms since epoch)
    private lastAudioTimestamp: number | null = null;
    // interval id for inactivity checks
    private inactivityInterval: any = null;

    urlParams = new URLSearchParams(window.location.search);
    mode = this.urlParams.get('mode');

    /**
     * Creates an Azure recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Expected language of the speech to be transcribed
     */
    constructor(scribearServerStatus: ScribearServerStatus, selectedModelOption: SelectedOption, language: string) {
        console.log("ScribearRecognizer, new recognizer being created!")

        this.language = language;
        this.selectedModelOption = selectedModelOption;
        this.scribearServerStatus = scribearServerStatus;
    }

    private async _startRecording() {
        let mic_stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        this.recorder = new RecordRTC(mic_stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            desiredSampRate: this.kSampleRate,
            timeSlice: 50,
            ondataavailable: async (blob: Blob) => {
                // update last audio timestamp and mark that we've received at least one audio chunk
                this.lastAudioTimestamp = Date.now();
                try { (window as any).__lastAudioTimestamp = this.lastAudioTimestamp; } catch (e) {}
                try { (window as any).__hasReceivedAudio = true; if ((window as any).__initialAudioTimer) { clearTimeout((window as any).__initialAudioTimer); (window as any).__initialAudioTimer = null; } } catch (e) {}
                try {
                    const controlState = (store.getState() as any).ControlReducer;
                    if (controlState?.micNoAudio === true) {
                        store.dispatch({ type: 'SET_MIC_INACTIVITY', payload: false });
                    }
                } catch (e) {
                    console.warn('Failed to clear mic inactivity', e);
                }
                this.socket?.send(blob);
            },
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,
        });

        this.recorder.startRecording();

        // start inactivity monitor: if mic is on but we haven't received audio for threshold -> set micNoAudio
        const thresholdMs = 3000; // consider no audio if no chunks in 3s
        if (this.inactivityInterval == null) {
            this.inactivityInterval = setInterval(() => {
                try {
                    const state: any = store.getState();
                    const listening = state.ControlReducer?.listening === true;
                    const micNoAudio = state.ControlReducer?.micNoAudio === true;
                    if (listening) {
                        if (!this.lastAudioTimestamp || (Date.now() - this.lastAudioTimestamp > thresholdMs)) {
                            if (!micNoAudio) {
                                store.dispatch({ type: 'SET_MIC_INACTIVITY', payload: true });
                            }
                        } else {
                            if (micNoAudio) {
                                store.dispatch({ type: 'SET_MIC_INACTIVITY', payload: false });
                            }
                        }
                    } else {
                        // not listening: ensure flag is cleared
                        if (micNoAudio) store.dispatch({ type: 'SET_MIC_INACTIVITY', payload: false });
                    }
                } catch (e) {
                    console.warn('Error in mic inactivity interval', e);
                }
            }, 1000);
        }
    }

    /**
     * Makes the Azure recognizer start transcribing speech asynchronously, if it has not started already
     * Throws exception if recognizer fails to start
     */
    start() {
        console.log("ScribearRecognizer.start()");
        if (this.socket) { return; }

        const scribearURL = new URL(this.scribearServerStatus.scribearServerAddress)
        if (scribearURL.pathname !== '/api/sink') {
            this._startRecording();
        }

        this.socket = new WebSocket(this.scribearServerStatus.scribearServerAddress);

        this.socket.onopen = (event) => {
            this.socket?.send(JSON.stringify({
                api_key: this.scribearServerStatus.scribearServerKey,
                sourceToken: this.scribearServerStatus.scribearServerKey,
                sessionToken: this.scribearServerStatus.scribearServerSessionToken,
            }));
            // Notify UI that the socket is open/available
            try {
                store.dispatch({ type: 'CHANGE_API_STATUS', payload: { scribearServerStatus: STATUS.AVAILABLE } });
            } catch (e) {
                console.warn('Failed to dispatch API status AVAILABLE', e);
            }
        }

        const inProgressBlock = new TranscriptBlock();

        this.socket.onmessage = (event) => {
            if (!this.ready && this.mode !== 'student') {
                const message = JSON.parse(event.data);
                console.log(message);
                if (message['error'] || !Array.isArray(message)) return;

                store.dispatch(setModelOptions(message));

                if (this.selectedModelOption) {
                    this.socket?.send(JSON.stringify(this.selectedModelOption));
                    this.ready = true;
                    // Client has informed server which model to use — consider the connection active/ready
                    try {
                        store.dispatch({ type: 'CHANGE_API_STATUS', payload: { scribearServerStatus: STATUS.TRANSCRIBING } });
                    } catch (e) {
                        console.warn('Failed to dispatch API status TRANSCRIBING', e);
                    }
                }
                return;
            }

            const server_block: BackendTranscriptBlock = JSON.parse(event.data);

            // Todo: extract type of message (inprogress v final) and the text from the message
            const inProgress = server_block.type === BackendTranscriptBlockType.InProgress;
            const text = server_block.text;

            if (inProgress) {
                inProgressBlock.text = text; // replace text
                this.transcribedCallback([], inProgressBlock);
            } else {
                inProgressBlock.text = "" //reset in progress
                const finalBlock = new TranscriptBlock();
                finalBlock.text = text
                this.transcribedCallback([finalBlock], inProgressBlock)
            }
        };

        this.socket.onerror = (event) => {
            const error = new Error("WebSocket error");
            console.error("WebSocket error event:", event);
            try {
                store.dispatch({ type: 'CHANGE_API_STATUS', payload: { scribearServerStatus: STATUS.ERROR } });
            } catch (e) {
                console.warn('Failed to dispatch API status ERROR', e);
            }
            this.errorCallback?.(error);
        };

        this.socket.onclose = (event) => {
            console.warn(`WebSocket closed: code=${event.code}, reason=${event.reason}`);
            this.socket = null;
            try {
                store.dispatch({ type: 'CHANGE_API_STATUS', payload: { scribearServerStatus: STATUS.UNAVAILABLE } });
            } catch (e) {
                console.warn('Failed to dispatch API status UNAVAILABLE', e);
            }
            if (event.code == 3000) { // API key error
                try {
                    store.dispatch({ type: 'CHANGE_API_STATUS', payload: { scribearServerStatus: STATUS.ERROR, scribearServerMessage: 'ScribeAR Server rejected credentials (invalid API key/token)' } });
                } catch (e) {
                    console.warn('Failed to dispatch API status for code 3000', e);
                }
            } else if (event.code !== 1000) { // 1000 = normal closure
                const error = new Error(`WebSocket closed unexpectedly: code=${event.code}`);
                this.errorCallback?.(error);
            }

        };
    }

    /**
     * Makes the Azure recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        console.log("ScribearRecognizer.stop()");
        this.recorder?.stopRecording();
        if (!this.socket) { return; }
        this.socket.close();
        this.socket = null;
        // clear inactivity interval and reset mic inactivity flag
        if (this.inactivityInterval) {
            clearInterval(this.inactivityInterval);
            this.inactivityInterval = null;
        }
        try {
            store.dispatch({ type: 'SET_MIC_INACTIVITY', payload: false });
        } catch (e) {
            console.warn('Failed to clear mic inactivity on stop', e);
        }
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech or some transcript has been finalized
     * @param callback A callback function called with the updates to the transcript
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        console.log("ScribearRecognizer.onTranscribed()");
        // "recognizing" event signals that the in-progress block has been updated
        this.transcribedCallback = callback;
    }

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error that it cannot handle
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void) {
        console.log("ScribearRecognizer.onError()");
        this.errorCallback = callback;
    }


}


