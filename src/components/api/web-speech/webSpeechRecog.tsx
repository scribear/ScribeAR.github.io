import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { makeEventBucket } from '../../../react-redux&middleware/react-middleware/thunkMiddleware';
import { ControlStatus, ApiStatus, SRecognition } from '../../../react-redux&middleware/redux/typesImports';
import { API, STATUS } from '../../../react-redux&middleware/redux/enumsImports';


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
 * @return Promise<boolean>
 */
export const useWebSpeechRecog = (recognizer : SpeechRecognition) => new Promise<boolean>((resolve, reject) => {
   const dispatch = useDispatch();
   try {
      const lastStartedAt = new Date().getTime();
      recognizer.onresult = (event: SpeechRecognitionEvent) => {
         const makeEventBucketThunk = makeEventBucket({stream: 'html5', value: event.results});
         // console.log(50, 'ahaha');
         dispatch(makeEventBucketThunk);
      };
      recognizer.onend = (event: any) => { 
         console.log('onend, event: ', event);
         const timeSinceStart = new Date().getTime() - lastStartedAt;
         if (timeSinceStart > 1000) {
            recognizer.start();
         }

         dispatch('transcript/end');
      }
      console.log(62, 'start');
      recognizer.start();
      resolve(true);
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   };
})
