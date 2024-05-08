import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';

/**
 * A SpeechRecognition recognizer yields an array of blocks, each containing a transcript string, a final / in-progress bit, and some extra info
 * 
 * Whenever the array is updated, a recognized event is triggered. A recognized event is also triggered when the recognizer
 * Receives the stop signal, as the in-progress blocks are forced to be finalized before stopping the recognizer.
 * 
 * If we conceptualize it as an array of final blocks and an array of in progress blocks, then they obey
 * these invariants:
 * 
 * 1. The array of final blocks is append-only, array_old is a prefix of array_new
 * 2. The array of in-progress blocks can only contain 0-2 blocks
 * 3. Both arrays are emptied when the recognier starts / restarts
 * 4. The in-progress array is empty in the last array update event immediately before the recognizer stops
 */

/**
 * Wrapper for HTML5's SpeechRecognition class that implements Recognizer interface
 */
export class StreamTextRecognizer implements Recognizer {
// CHANGE ME!!! Elephants are cool

    /**
     * Underlying Web Speech recognizer instance, see documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API 
     */
    private recognizer: SpeechRecognition;
    /**
     * Number of final blocks in the recognizer's last event
     * Used to only return new final blocks
     */
    private prevFinalBlockNum: number = 0;
    /**
     * Whether the recognizer should be running right now
     * Used to restart recognizer if it were to go into sleep due to inactivity
     * Also prevents double start() or end(), which cause errors
     */
    private shouldBeRunning: boolean = false;

    /**
     * Creates an Web Speech recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Expected language of the speech to be transcribed
     */
    constructor(audioSource: any, language: string) {
        console.log("Web Speech recognizer, new recognizer being created!")
        if (!window || !(window as any).webkitSpeechRecognition) {
            throw new Error('Your browser does not support web speech recognition');
        }
        try {
            this.recognizer = new (window as any).webkitSpeechRecognition();
            this.recognizer.continuous = true;
            this.recognizer.interimResults = true;
            this.recognizer.lang = language;
            // Restart recognizer if it went to sleep
            this.recognizer.onend = (ev) => {
                console.log(ev);
                if (this.shouldBeRunning) this.start();
            }
            
        } catch (e) {
            const error_str : string = `Failed to Make WebSpeech SpeechRecognition, error: ${e}`;
            throw new Error(error_str);
        }
    }

    /**
     * Makes the Web Speech recognizer start transcribing speech, if not already started
     * Throws exception if recognizer fails to start
     */
    start() {
        if (!this.shouldBeRunning) {
            this.shouldBeRunning = true;
            this.prevFinalBlockNum = 0; // Webspeech clears all final blocks when restarting
            this.recognizer.start();
        }
    }

    /**
     * Makes the Web Speech recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        if (this.shouldBeRunning) {
            this.shouldBeRunning = false;
            this.recognizer.stop();
        }
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech or finalized some in-progress part
     * @param callback A callback function called with updates to the transcript
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        try {
            this.recognizer.onresult = (event) => {
                // Find how many final blocks the new result has
                let finalBlockNum = 0;
                for (finalBlockNum = this.prevFinalBlockNum;
                    finalBlockNum < event.results.length && event.results[finalBlockNum].isFinal;
                    finalBlockNum++) {}

                let newFinalBlocks = Array<TranscriptBlock>();
                let newInProgressBlock = new TranscriptBlock();
                // Gather all new final blocks
                for (let i = this.prevFinalBlockNum; i < finalBlockNum; i++) {
                    const result = event.results[i];
                    let block = new TranscriptBlock();
                    // Each result could have multiple alterantive transcription, arbitrarily choose first one
                    block.text = result[0].transcript;
                    newFinalBlocks.push(block);
                }
                // Concat all new in-progress blocks
                for (let i = finalBlockNum; i < event.results.length; i++) {
                    const result = event.results[i];
                    newInProgressBlock.text += result[0].transcript;
                }
                // Update number of seen final blocks
                this.prevFinalBlockNum = finalBlockNum;

                callback(newFinalBlocks, newInProgressBlock);
            }
        } catch (e) {
            throw new Error(`Could not add callback to Web Speech recognizer, error: ${e}`)
        }
    }

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void) {
        // Signals that the recognizer has encountered an error of some kind
        this.recognizer.onerror = (ev) => {
            if (ev.error == 'no-speech') {
                return;
            }
            console.log(`WebSpeech on error, event: ${ev}`);
            callback(new Error(ev.message))
        }
    }

}