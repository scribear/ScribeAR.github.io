import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';

import { ControlStatus, AzureStatus, ApiStatus, PhraseList, STATUS } from '../../../react-redux&middleware/redux/typesImports';
import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';
import { Recognizer } from '../recognizer';
import { TranscriptBlock } from '../../../react-redux&middleware/redux/types/TranscriptTypes';

// TODO: Do we still need API status and updating API status?
// TODO: How does event bucket thunk work? What should onTranscribed feed to the callback?

export class AzureRecognizer implements Recognizer {
    /**
     * Underlying azure recognizer instance
     * Azure recognizer SDK: https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest 
     */
    private recognizer: speechSDK.TranslationRecognizer;

    /**
     * Creates an Azure recognizer instance that listens to the default microphone
     * and expects speech in the given language 
     * @param audioSource Not implemented yet
     * @param language Expected language of the speech to be transcribed
     */
    constructor(audioSource: any, language: string, azureArgs: AzureStatus) {
        console.log("Azure recognizer, new recognizer being created!")
        try {
            const speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azureArgs.azureKey, azureArgs.azureRegion)
            speechConfig.speechRecognitionLanguage = language;
            speechConfig.addTargetLanguage(language);
            speechConfig.setProfanity(2);

            const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
            this.recognizer = new speechSDK.TranslationRecognizer(speechConfig, audioConfig);
               
            let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(this.recognizer);
            for (let i = 0; i < azureArgs.phrases.length; i++) {
                phraseList.addPhrase(azureArgs.phrases[i])
            }
        } catch (e : any) {
            throw new Error(`Failed to Make Azure TranslationRecognizer, error: ${e}`);
        }
    }

    /**
     * Makes the Azure recognizer start transcribing speech asynchronously
     * Throws exception if recognizer fails to start
     */
    start() {
        this.recognizer.startContinuousRecognitionAsync();
    }

    /**
     * Makes the Azure recognizer stop transcribing speech asynchronously
     * Throws exception if recognizer fails to stop
     */
    stop() {
        this.recognizer.stopContinuousRecognitionAsync();
    }

    /**
     * Subscribe a callback function to the transcript update event, which is usually triggered
     * when the recognizer has processed more speech
     * @param callback A callback function called with the latest transcript when the event is triggered
     */
    onTranscribed(callback: (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock) => void) {
        // "recognizing" event signals that the in-progress block has been updated
        // event.result.text is new in-progress block's text
        try {
            this.recognizer.recognizing = (sender, event) => {
                const newInProgressBlock = new TranscriptBlock;
                newInProgressBlock.text = event.result.text;
                callback([], newInProgressBlock);
            }
            this.recognizer.recognized = (sender, event) => {
                if (event.result.reason == speechSDK.ResultReason.NoMatch) {
                    // Spurious "recognized" event can be triggered with empty transcript text
                    // Possibly an Azure bug
                    return; 
                }
                // "recognized" signals that the current in-progress block is finalized
                // event.result.text is the finalized block's text
                // In-progress block should also be cleared
                const newFinalBlock = new TranscriptBlock;
                newFinalBlock.text = event.result.text;
                const newInProgressBlock = new TranscriptBlock;
                callback([newFinalBlock], newInProgressBlock);
            }
        } catch (e) {
            throw new Error(`Could not add callback to Azure recognizer, error: ${e}`)
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

    /**
     * Add Domain phrases to the recognizer 
     * @param newPhrases New phrases to be added
     */
    addPhrases(newPhrases: string[]) {
        let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(this.recognizer);
        phraseList.addPhrases(newPhrases);
    }
}


/**
 * Used in Azuredropdown.tsx; return a TranslationRecognizer is no error
 * 
 * @param control type of ControlStatus
 * @param azure type of AzureStatus
 * @returns a TranslationRecognizer
 */
export const testAzureTranslRecog = async (control: ControlStatus, azure: AzureStatus) => new Promise<void>((resolve, reject) => {
    try {
        const recognizer: Recognizer = new AzureRecognizer(null, control.speechLanguage.CountryCode, azure);
        recognizer.onError((e) => {
            console.log(`CANCELED: Reason=${e.message}, Did you update the subscription info?`);
            reject();
        })
        recognizer.start()
        resolve();
    } catch (e) {
      reject();
    };
});

