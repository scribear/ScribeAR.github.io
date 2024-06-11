import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';
import { ScribearServerStatus } from '../../../react-redux&middleware/redux/typesImports';


/**
 * 
 * Whenever the block is updated but still in-progress, a recognizing event is triggered. Whenever the block
 * becomes final, a recognized event is triggered.
 * 
 * A recognized event is also triggered when the stop signal is received, as the block is forced
 * to be finalized before stopping the recognizer. This is followed by a **spurious** recognized event
 * that yields an empty string
 * 
 * The block obeys these invariants:
 * 
 * 1. If in event k the block is final, in event k+1 the block will be in-progress and transcribing the next segment of speech
 * 2. If in event k it's in-progress instead, it could still be in-progress in k+1, transcribing the same segment of speech
 * 3. The block is empty when the recognizer starts / restarts
 * 3. The block is guaranteed to be final in the last recognized event immediately before the recognizer stops
 */

/**
 * Wrapper for Microsoft Azure SpeechRecognizer class, implements Recognizer interface 
 */
export class ScribearRecognizer implements Recognizer {
    private scribearServerStatus : ScribearServerStatus
    private socket : WebSocket | null = null
    private transcribedCallback : any
    private language : string
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
            // Todo: extract type of message (inprogress v final) and the text from the message
            const inProgress:boolean = event.data[0] === 'I'
            var text:string = event.data.substring(1);

            if(inProgress) {
                inProgressBlock.text += text; // append
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


