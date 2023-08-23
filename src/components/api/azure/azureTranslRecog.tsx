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
 * JS Promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 
 * Azure recognizer SDK: https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/?view=azure-node-latest 
 */

/**
 * Try to instantiate and return an Azure recognizer object using the given parameters
 * The recognizer is set to recognize the current speech language, does not translate, and masks profanities
 * 
 * @param control Global parameters of ScribeAR, see ControlStatus for more info 
 * @param azureStatus Parameters used specifically by Azure
 * @param mic ID of current microphone
 * 
 * @returns An azure recognizer, or an error string if it could not instantiate the recognizer
 */
export const getAzureTranslRecog = async (control: ControlStatus, azureStatus: AzureStatus, mic : number = 0) => new Promise<speechSDK.TranslationRecognizer>((resolve, reject) => {  
   try {
      const speechConfig = speechSDK.SpeechTranslationConfig.fromSubscription(azureStatus.azureKey, azureStatus.azureRegion)
      speechConfig.speechRecognitionLanguage = control.speechLanguage.CountryCode;
      speechConfig.addTargetLanguage(control.textLanguage.CountryCode);
      // console.log("Speech: ", speechConfig.speechRecognitionLanguage, "; Text: ", speechConfig.targetLanguages);
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
 * @param recognizer speechSDK.TranslationRecognizer
 * @returns [string[], recognizer, start function]
 */
export const useAzureTranslRecog = (recognizer : speechSDK.TranslationRecognizer, dispatch : React.Dispatch<any>) => new Promise<void>((resolve, reject) => {
   try {
      // e.result is a TranslationRecognitionResult
      recognizer.recognizing = (s, e) => {
         console.log(89);
         const eventBucketThunk = makeEventBucket({ stream: 'azure', value: { confidence: -1, transcript: e.result.text }});
         dispatch(eventBucketThunk);
      };
      recognizer.recognized = (s, e) => {
         console.log(101, speechSDK.PhraseListGrammar.fromRecognizer(recognizer));
         dispatch({ type: 'transcript/azure/recognized', payload: {newTranscript: e.result.text} }); // TODO: modify, think over how this would affect the Stream
      };
      recognizer.sessionStarted = (s, e) => {
         console.log(`Azure, sessionStarted, event: ${JSON.stringify(e)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.TRANSCRIBING} });
      };
      recognizer.sessionStopped = (s, e) => {
         console.log(`Azure, sessionStopped, event: ${JSON.stringify(e)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ENDED} });
      };
      // recognizer.speechEndDetected = (s, e) => {
      //    console.log(`Azure, speechEndDetected, event: ${JSON.stringify(e)}`);
      //    dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ENDED} });
      //    dispatch({ type: 'transcript/end' });
      // };
      resolve();
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to Azure TranslationRecognizer, error: ${e}`;
      reject(error_str);
   }
});
