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
                this.socket?.send(blob);
            },
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,
        });

        this.recorder.startRecording();
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


