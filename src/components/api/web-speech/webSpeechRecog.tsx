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
      console.log(typeof speechRecognition);
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
         dispatch(makeEventBucketThunk);
      };
      recognizer.onend = (event: any) => { 
         console.log('onend, event: ', event);
         const timeSinceStart = new Date().getTime() - lastStartedAt;
         if (timeSinceStart > 1000) {
            recognizer.start();
         }
      }
      recognizer.start();
      resolve(true);
   } catch (e) {
      const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
      reject(error_str);
   };
})










// /**
//  * Setup the recognizer for WebSpeech
//  * 
//  * @param recognizer 
//  * @param control 
//  * @param api 
//  * 
//  * @return Promise<boolean>
//  */
// export const oldUseWebSpeechRecog = (recognizer : SpeechRecognition, control : ControlStatus, api : ApiStatus) => new Promise<boolean>((resolve, reject) => {
//    const dispatch = useDispatch();
//    try {
//       const lastStartedAt = new Date().getTime();
//       recognizer.onresult = (event: SpeechRecognitionEvent) => {
//          if (control.listening == false || api.currentApi != 0) {
//             recognizer.stop();
//          } else {
//             const makeEventBucketThunk = makeEventBucket({stream: 'html5', value: event.results});
//             dispatch(makeEventBucketThunk);
//          }
//       };
//       recognizer.onend = (event: any) => { 
//          console.log('onend, event: ', event);
//          const timeSinceStart = new Date().getTime() - lastStartedAt;
//          if (control.listening && api.currentApi === 0) {
//             if (timeSinceStart > 1000) {
//                recognizer.start();
//             }
//          } else {
//             recognizer.stop();
//          }
//       }
//       recognizer.start();
//       resolve(true);
//    } catch (e) {
//       const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
//       reject(error_str);
//    };
// })















// export const oldOldUseWebSpeechRecog = (speechRecognition : SpeechRecognition) => {
//    const dispatch = useDispatch();
//    let transcript="";
//    const [transcripts, setTranscripts] = React.useState<string[]>([]);
//    const listen = useCallback(
//       async (transcriptsFull: string, control: React.MutableRefObject<ControlStatus>,  currentApi: React.MutableRefObject<ApiStatus>) =>
//          new Promise((resolve, reject) => {
//          try {
//             const lastStartedAt = new Date().getTime();
//             speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
//                if (control.current.listening == false || currentApi.current.currentApi != 0) {
//                speechRecognition.stop()
//                resolve(transcriptsFull);
//                } else {
//                // console.log(event.results);
//                const makeEventBucketThunk = makeEventBucket({stream: 'html5', value: event.results});
//                dispatch(makeEventBucketThunk);
//                const finalResult = Array.from(event.results)
//                .map(result => result[0])
//                .map(result => result.transcript)
//                .join('');
//                transcript = finalResult;

//                if (event.results[0].isFinal) {
//                   console.log(finalResult);
//                }    
//                setTranscripts([...transcripts, transcript]);
//                transcriptsFull = transcript;
//                }
//             };
      
//             speechRecognition.onend = () => { 
//                const timeSinceStart = new Date().getTime() - lastStartedAt;
//                if (control.current.listening && currentApi.current.currentApi === 0) {
//                if (timeSinceStart > 1000) {
//                   speechRecognition.start();
//                }
//                } else {
//                resolve(transcriptsFull);   
//                }
//             }

//             speechRecognition.start();
//          } catch (e) {
//             const error_str : string = `Failed to Add Callbacks to WebSpeech SpeechRecognition, error: ${e}`;
//             reject(error_str);
//          }
//          }),
//       [setTranscripts]
//    );

//    return useMemo(() => ({ transcripts, speechRecognition, listen }), [transcripts]);
// };