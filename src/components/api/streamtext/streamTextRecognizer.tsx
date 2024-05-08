import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';

import { AzureStatus, ControlStatus } from '../../../react-redux&middleware/redux/typesImports';

import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';

/**
 * Azure recognizer only yield a single block that contains a transcript string, and a final / in progress bit
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

/**
 * Wrapper for Microsoft Azure SpeechRecognizer class, implements Recognizer interface 
 */
export class StreamTextRecognizer implements Recognizer {
    /**
     * Underlying azure recognizer instance
     * Azure recognizer SDK: https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest 
     */
    private event: string
    private language: string
    private lastPosition: number
    private session: any

    /**
     * Creates an Azure recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Expected language of the speech to be transcribed
     */
    constructor(event: string, language: string) {
        console.log("Azure recognizer, new recognizer being created!")
        try {

            this.event = event
            this.language = language
            this.lastPosition = 0
        } catch (e : any) {
            throw new Error(`Failed to Make Azure TranslationRecognizer, error: ${e}`);
        }
    }

    /**
     * Makes the Azure recognizer start transcribing speech asynchronously, if it has not started already
     * Throws exception if recognizer fails to start
     */
    start() {
    }

    /**
     * Makes the Azure recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        clearInterval(this.session);
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech or some transcript has been finalized
     * @param callback A callback function called with the updates to the transcript
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        // "recognizing" event signals that the in-progress block has been updated
        // event.result.text is new in-progress block's text
        try {
            let newInProgressBlock = new TranscriptBlock;
            this.session = setInterval(() => {
                let api = `https://www.streamtext.net/captions?event=${this.event}&last=${this.lastPosition}&language=${this.language}`
                console.log(api)
                fetch(api).then(
                    response => response.json()
                ).then(
                    json => {
                        this.lastPosition = json.lastPosition
                        newInProgressBlock.text += json.content
                        callback([], newInProgressBlock)
                    }
                )
            }, 1000);
        } catch (e) {
            throw new Error(`Could not add callback to StreamText recognizer, error: ${e}`)
        }
    }

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error that it cannot handle
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void) {
        // Do nothing, Azure does not have an error event
    }
}