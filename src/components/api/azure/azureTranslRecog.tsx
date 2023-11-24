import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { 
   TranslationRecognitionResult, RecognitionResult,
} from 'microsoft-cognitiveservices-speech-sdk';

import { RootState } from '../../../store';
import { ControlStatus, AzureStatus, ApiStatus, PhraseList, STATUS } from '../../../react-redux&middleware/redux/typesImports';
import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';


/**
 * References:
 * Azure recognizer SDK: https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest 
 */

/**
 * Try to instantiate and return an Azure recognizer object using the given parameters
 * The recognizer is set to recognize the current speech language, does not translate, and censor profanities
 * 
 * @param control Global parameters of ScribeAR, see ControlStatus for more info 
 * @param azureStatus Parameters used specifically by Azure
 * @param mic ID of microphone to be used
 * 
 * @returns An Azure TranslationRecognizer if instantiation succeds, else an error string
 */
export const getAzureTranslRecog = async (control: ControlStatus, azureStatus: AzureStatus, mic : number = 0) => new Promise<speechSDK.TranslationRecognizer>((resolve, reject) => {  
   try {
      const speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
      speechConfig.speechRecognitionLanguage = control.speechLanguage.CountryCode;
      speechConfig.addTargetLanguage(control.textLanguage.CountryCode);
      speechConfig.setProfanity(2);
      if (mic === 0) {
         const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
         const recognizer : speechSDK.TranslationRecognizer = new speechSDK.TranslationRecognizer(speechConfig, audioConfig);
         
         // add phraseList
         let phraseList = speechSDK.PhraseListGrammar.fromRecognizer(recognizer);
         for (let i = 0; i < azureStatus.phrases.length; i++) {
            phraseList.addPhrase(azureStatus.phrases[i])
         }
         
         resolve(recognizer);
      } else {
         reject(`Custom Mic (${mic}) Not Implemented!`);
      }
   } catch (e : any) {
      const error_str : string = `Failed to Make Azure TranslationRecognizer, error: ${e}`;
      reject(error_str);
   }
});

/**
 * Used in Azuredropdown.tsx; return a TranslationRecognizer is no error
 * 
 * @param control type of ControlStatus
 * @param azure type of AzureStatus
 * @returns a TranslationRecognizer
 */
export const testAzureTranslRecog = async (control: ControlStatus, azure: AzureStatus) => new Promise<speechSDK.TranslationRecognizer>((resolve, reject) => {
   getAzureTranslRecog(control, azure).then((recognizer : speechSDK.TranslationRecognizer) => {
      try {
         recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);
            let error_str : string = `Did you update the subscription info?`;
            if (e.reason === speechSDK.CancellationReason.Error) {
               console.log(`CANCELED: ErrorCode=${e.errorCode}; ErrorDetails=${e.errorDetails}`);
               error_str = `${e.errorDetails}.\nDid you update the subscription info?`;
            }
            reject(error_str);
         };
         recognizer.sessionStarted = () => {
            resolve(recognizer);
         };
         recognizer.recognizeOnceAsync();
      } catch (e : any) {
         const error_str : string = `Failed to Add Callbacks to Azure TranslationRecognizer, error: ${e}`;
         reject(error_str);
      }
   }, (error_str : string) => {
      reject(error_str);
   });
});

/**
 * Subscribing to Azure TranslationRecognizer's incomplete result, complete result, start, and stop event
 * To dispatch transcript and status updates to the redux store 
 * 
 * @param recognizer An Azure TranslationRecognizer
 * @param dispatch Redux dispatch function
 * @returns Error message if it fails to subscribe
 */
export const useAzureTranslRecog = (recognizer : speechSDK.TranslationRecognizer, dispatch : React.Dispatch<any>) => new Promise<void>((resolve, reject) => {
   // see https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/recognitionresult?view=azure-node-latest
   try {
      // Azure recognizes speech in "paragraphs," defined as continuous speech with short pauses.
      // When it detects a long enough pause, it stops the current paragraph and starts a new paragraph
      recognizer.recognizing = (s, e) => {
         // Signals that the current paragraph is not yet over, but more transcript is available
         // event.result.text is the in-progress transcript of the current paragraph
         // Newer event.result.text is not guaranteed to contain older event.result.text as prefix, e.g. "Five bites" -> "Five bytes of memory"
         console.log("Azure, incomplete transcript", e.result);
         const eventBucketThunk = makeEventBucket({ stream: 'azure', value: { confidence: -1, transcript: e.result.text }});
         dispatch(eventBucketThunk); 
         // TODO: Documentation for makeEventBucket and dispatching thunk
      };
      recognizer.recognized = (s, e) => {
         // Signals that the current paragraph is over.
         // event.result.text is the finalized transcript of the current paragraph
         console.log("Azure, finalized transcript", e.result);
         dispatch({ type: 'transcript/azure/recognized', payload: {newTranscript: e.result.text} }); // TODO: modify, think over how this would affect the Stream
      };
      recognizer.sessionStarted = (s, e) => {
         // Signals that the recognizer has started accepting and processing speech
         console.log(`Azure, sessionStarted, event: ${JSON.stringify(e)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.TRANSCRIBING} });
      };
      recognizer.sessionStopped = (s, e) => {
          // Signals that the recognizer has stopped accepting and processing speech
         console.log(`Azure, sessionStopped, event: ${JSON.stringify(e)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ENDED} });
      };
      resolve();
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to Azure TranslationRecognizer, error: ${e}`;
      reject(error_str);
   }
});
