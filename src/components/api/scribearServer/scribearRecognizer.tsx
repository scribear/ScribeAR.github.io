import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import { ScribearServerStatus } from '../../../react-redux&middleware/redux/typesImports';
import RecordRTC, {StereoAudioRecorder} from 'recordrtc';


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
    private scribearServerStatus : ScribearServerStatus
    private socket : WebSocket | null = null
    private transcribedCallback : any
    private language : string
    private recorder?: RecordRTC;
    private kSampleRate = 16000;



    /**
     * Creates an Azure recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Expected language of the speech to be transcribed
     */
    constructor(scribearServerStatus: ScribearServerStatus, language:string) {
        console.log("ScribearRecognizer, new recognizer being created!")
        this.language = language;
        this.scribearServerStatus = scribearServerStatus;
        this._startRecording();
    }

    private async _startRecording() {
        let mic_stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});

        this.recorder = new RecordRTC(mic_stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            desiredSampRate: this.kSampleRate,
            timeSlice: 1_000,
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
        if(this.socket) {return;}

        this.socket = new WebSocket(this.scribearServerStatus.scribearServerAddress);

        // this.socket.onopen = (e)=> {...}
        const inProgressBlock = new TranscriptBlock();
        
        this.socket.onmessage = (event)=> {
            const server_block: BackendTranscriptBlock = JSON.parse(event.data);

            // Todo: extract type of message (inprogress v final) and the text from the message
            const inProgress = server_block.type === BackendTranscriptBlockType.InProgress;
            const text = server_block.text;

            if(inProgress) {
                inProgressBlock.text = text; // replace text
                this.transcribedCallback([], inProgressBlock);
            } else {
                inProgressBlock.text = "" //reset in progress
                const finalBlock = new TranscriptBlock();
                finalBlock.text = text
                this.transcribedCallback([finalBlock], inProgressBlock)
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
        if(! this.socket) {return;}
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
        console.log("ServerRecognizer.onError()");
    }


}


