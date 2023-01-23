import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';
import { 
   ControlStatus, ApiStatus, SRecognition,
   API, ApiType, STATUS, StatusType,
} from '../../../react-redux&middleware/redux/typesImports';


/**
 * 
 * @param {ControlStatus} control 
 * @returns {Promise<SpeechRecognition>}
 */
export const getWebSpeechRecog = (control : ControlStatus) => new Promise<SpeechRecognition>((resolve, reject) => {
   try {
      if (!window || !(window as any).webkitSpeechRecognition) {
         reject('Your browser does not support web speech recognition');
      }
      const speechRecognition : SpeechRecognition = new (window as any).webkitSpeechRecognition();
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

/**
 * Setup the WebSpeech recognizer; add callbacks
 * 
 * Assume control.listening=true and api=API.WEBSPEECH.
 * 
 * @param {SpeechRecognition} recognizer 
 * @param {React.Dispatch} dispatch 
 * @return {Promise<void>}
 */
export const useWebSpeechRecog = (recognizer : SpeechRecognition, dispatch : React.Dispatch<any>) => new Promise<void>((resolve, reject) => {
   try {
      recognizer.onresult = (event: SpeechRecognitionEvent) => {
         const eventBucketThunk = makeEventBucket({ stream: 'html5', value: event.results });
         dispatch(eventBucketThunk);
      };
      recognizer.onend = (event: any) => { 
         console.log(`WebSpeech, onend, event: ${event}`);
         dispatch({ type: 'transcript/end' });
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ENDED} });
      }
      recognizer.onspeechstart = (event: any) => {
         console.log(`WebSpeech, onspeechstart, event: ${JSON.stringify(event)}`);
      }
      recognizer.onspeechend = (event: any) => {
         console.log(`WebSpeech, onspeechend, event: ${JSON.stringify(event)}`);
      }
      recognizer.onstart = (event: any) => {
         console.log(`WebSpeech, onstart, event: ${JSON.stringify(event)}`);
         dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.TRANSCRIBING} });
      }
      recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
         console.log(`WebSpeech, onerror, event: ${event}`);
         if (event.error !== 'no-speech') {
            console.log('error not no-speech');
            dispatch({ type: 'transcript/end' });
            dispatch({ type: 'sRecog/set_status', payload: {status: STATUS.ERROR} });
         }
      }
      resolve();
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   };
})
