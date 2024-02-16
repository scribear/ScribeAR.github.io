import { TranscriptBlock } from "../../react-redux&middleware/redux/types/TranscriptTypes";
/**
 * Abstractly, a recognizer is an object that has the following functions
 * 
 * void start()
 *      Makes the recognizer starts transcribing speech, if it has not already started
 * 
 * void stop()
 *      Makes the recognizer stops transcribing speech, if it has not already stopped
 * 
 * void onTranscribed((list of new final blocks, new WIP block) -> void Callback)
 *      Subscribes a callback function to be called whenever the transcript is updated -
 *      when more speech has been transcribed, or some transcript has been finalized
 * 
 * void onError(error -> void Callback)
 *      Subscribes a callback function to the recognizer error event, which is triggered
 *      when the recognizer encouters an error (that may or may not be fatal)
 * 
 * In the future, we want all recognizer to be constructed by a function like such:
 * 
 * Recognizer createRecognizer(audioSource, language)
 *      Where audioSource could be either microphone, stream, or audio file
 *      (By Convert all of them to a stream format of some sort first?)
 */

/**
 * Abstract recognizer interface that describes an async speech recognizer that converts
 * speech to transcript
 */
export interface Recognizer{
    // TODO: create audio source type

    /**
     * Makes the recognizer start transcribing speech asynchronously
     * 
     * Throws exception if recognizer fails to start
     */
    start();

    /**
     * Makes the recognizer stop transcribing speech asynchronously
     * 
     * Throws exception if recognizer fails to stop
     */
    stop();

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech
     * @param callback A callback function called with newly finalized blocks and new in-progress block
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void);

    /**
     * Subscribe a callback function to the error event, which is triggered
     * when the recognizer has encountered an error that it cannot handle
     * @param callback A callback function called with the error object when the event is triggered
     */
    onError(callback: (e: Error) => void);
}

