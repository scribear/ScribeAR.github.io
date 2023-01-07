import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { makeEventBucket, makeTranscriptEnd, makeEndErrorHanlder } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';
import { 
   ControlStatus, ApiStatus, SRecognition,
   API, ApiType, STATUS, StatusType,
} from '../../../react-redux&middleware/redux/typesImports';



export const getWebSpeechRecog = (control : ControlStatus) => new Promise<SpeechRecognition>((resolve, reject) => {
   try {
      if (!window || !(window as any).webkitSpeechRecognition) {
         throw new Error('Your browser does not support web speech recognition');
      }
      const speechRecognition : SpeechRecognition = new (window as any).webkitSpeechRecognition();
      // console.log(typeof speechRecognition);
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = control.speechLanguage.CountryCode;
      // speechRecognition.lang = 'pl-PL';
      resolve(speechRecognition);
   } catch (e) {
      const error_str : string = `Failed to Make WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   }
});

// type useArgs = {
//    recognizer : SpeechRecognition,
//    control : ControlStatus,
//    apiStatus : ApiStatus,
// }

/**
 * Setup the recognizer for WebSpeech
 * 
 * Assume control.listening=true and api=API.WEBSPEECH.
 * 
 * @param recognizer 
 * @param control 
 * @param api 
 * 
 * @return Promise<void>
 */
export const useWebSpeechRecog = (recognizer : SpeechRecognition, dispatch : React.Dispatch<any>) => new Promise<void>((resolve, reject) => {
   console.log('in use');
   try {
      const lastStartedAt = new Date().getTime();
      recognizer.onresult = (event: SpeechRecognitionEvent) => {
         const eventBucketThunk = makeEventBucket({ stream: 'html5', value: event.results });
         console.log(50, 'ahaha');
         dispatch(eventBucketThunk);
      };
      recognizer.onend = (event: any) => { 
         console.log('onend, event: ', event);
         const recogEndThunk = makeEndErrorHanlder('html5');
         dispatch(recogEndThunk);
      }
      recognizer.onstart = (event: any) => {
         console.log('onstart, event: ', event);
      }
      recognizer.onerror = (event: any) => {
         console.log('onerror, event: ', event);
         const recogEndThunk = makeEndErrorHanlder('html5');
         dispatch(recogEndThunk);
      }
         
      // recognizer.start();
      resolve();
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   };
})
