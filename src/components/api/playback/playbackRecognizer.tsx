import { WebVTTParser } from 'webvtt-parser';

import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';

import { PlaybackStatus } from '../../../react-redux&middleware/redux/types/apiTypes';

/**
 * StreamText recognizer only yield a single block that contains a transcript string, and a final / in progress bit
 * Representing the transcript of the latest segment of speech
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

export class PlaybackRecognizer implements Recognizer {
    private session: any;
    private cues : any;
    private started = false;
    private startedAt : number;
    private elapsed : number;
    private callback : any;
    private lastCheck = -1;
    /**
     * Creates an StreamText recognizer instance that listens to an ongoing event
     * and expects speech in the given language 
     * @param event An ongoing event on StreamText
     * @param language Expected language of the speech to be transcribed
     */
    constructor(playbackStatus : PlaybackStatus) {
        console.log("PlaybackRecognizer created!",playbackStatus.captionFileContent);

        this.startedAt = 0;
        this.elapsed = 0;

        const parser = new WebVTTParser();
        const captionFile = playbackStatus.captionFileContent;
        if(captionFile) {
            const {cues} = parser.parse(captionFile, 'chapters');
           this.cues = cues;
           console.log(captionFile, this.cues);
        }
    }

    createDemo() {
        let newInProgressBlock = new TranscriptBlock();
        this.session = setInterval(() => {
            newInProgressBlock.text += `${1+(1 + newInProgressBlock.text.length)} `;
            if( newInProgressBlock.text.length> 10 ) {
                newInProgressBlock = new TranscriptBlock();
                const newFinalBlock = new TranscriptBlock();

                newFinalBlock.text = `Final ${new Date()}.`
                if( this.callback) {
                    this.callback([newFinalBlock], newInProgressBlock);
                }

            } else {
                if( this.callback) {
                    this.callback([], newInProgressBlock);
                }
            }
        }
    , 500);
    }
    /**
     * Makes the StreamText recognizer start transcribing speech asynchronously, if it has not started already
     * Throws exception if recognizer fails to start
     */
    start() {
        console.log("PlaybackRecognizer starting!");
        if( this.started) return;
        this.startedAt = Date.now() - this.elapsed;
        this.started = true;
        try {
            const dummy = false;
            if(dummy) {
                this.createDemo();
            } else {   
                this.session = setInterval(() => {
                    let text = '';

                    const sinceStart = (Date.now() - this.startedAt)/1000;
                    
                    this.cues.forEach( cue => {
                        // text += `(${cue.startTime} ${this.lastCheck} ${sinceStart})`;
                        if(cue.startTime > this.lastCheck && cue.startTime <=  sinceStart) {
                            text = text + (text.length >0 ?'<br>':'') + cue.text;
                        }
                    });
                    this.lastCheck = sinceStart; 
                    if(text.length > 0) {

                        const newInProgressBlock = new TranscriptBlock();
                        const newFinalBlock = new TranscriptBlock();

                        newFinalBlock.text = text;
                        if( this.callback) {
                            this.callback([newFinalBlock], newInProgressBlock);
                        }

                    } 
                } , 500);

            }  
        } catch (e) {
            throw new Error(`Could not add callback to StreamText recognizer, error: ${e}`)
        }
    }

    /**
     * Makes the StreamText recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        console.log("PlaybackRecognizer stopping!");
        if( ! this.started) return;

        this.elapsed = Date.now() - this.startedAt;

        if(this.session != null) {
            clearInterval(this.session);
        }
        this.session = null;
        this.started = false;
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech or some transcript has been finalized
     * @param callback A callback function called with the updates to the transcript
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        // "recognizing" event signals that the in-progress block has been updated
        // event.result.text is new in-progress block's text
       this.callback = callback;
    }

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error that it cannot handle
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void) {
        // Do nothing, StreamText does not have an error event
    }
}