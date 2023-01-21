import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition, Transcript,
   ScribeRecognizer, ScribeHandler, } from '../../react-redux&middleware/redux/typesImports';
import { API, ApiType, STATUS, StatusType } from '../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../store';

import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import { ControlPointOutlined } from '@material-ui/icons';
import { resolve } from 'path';


// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

/*
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
DO NOT DELETE IN ANY CIRCUMSTANCE
export const returnRecogAPI = (api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {
   // const apiStatus = useSelector((state: RootState) => {
   //    return state.APIStatusReducer as ApiStatus;
   // })
   // const control = useSelector((state: RootState) => {
   //    return state.ControlReducer as ControlStatus;
   // });
   // const azureStatus = useSelector((state: RootState) => {
   //    return state.AzureReducer as AzureStatus;
   // })
   const recognition : Promise<any> = getRecognition(api.currentApi, control, azure);
   const useRecognition : Object = makeRecognition(api.currentApi);
   // const recogHandler : Function = handler(api.currentApi);


   return ({ useRecognition, recognition });
}
* === * === *   DO NOT DELETE IN ANY CIRCUMSTANCE   * === * === *
* === * TRIBUTE TO THE ORIGINAL AUTHOR OF THIS CODE: Will * === *
*/

/**
 * 
 * @param recognition 
 * @returns 
 */
const makeWebSpeechHandler = (recognition : ScribeRecognizer) : ScribeHandler => {
   const handler : ScribeHandler = (action) => {
      // console.log(103, recognition, action);
      recognition = recognition as SpeechRecognition;
      switch (action.type) {
         case 'STOP':
            recognition!.stop();
            break
         case 'START':
            recognition!.start();
            break
         case 'ABORT':
            recognition!.abort();
            break
         case 'CHANGE_LANGUAGE':
            recognition.lang = action.payload!;
            break
         default:
            return "poggers";
      }
   }
   return handler;
}
/**
 * 
 * @param recognition 
 * @returns 
 */
const makeAzureTranslHandler = (recognition : ScribeRecognizer) : ScribeHandler => {
   const handler : ScribeHandler = (action) => {
      recognition = recognition as sdk.TranslationRecognizer;
      switch (action.type) {
         case 'STOP':
            recognition!.stopContinuousRecognitionAsync()
            break
         case 'START':
            recognition!.startContinuousRecognitionAsync()
            break
         case 'ABORT':
            recognition!.close()
            break
         case 'CHANGE_LANGUAGE':
            recognition!.addTargetLanguage(action.payload!)
            break
         default:
            return "poggers";
      }
   }
   return handler;
}


// export const testRecognition = (control: ControlStatus, azure: AzureStatus, currentApi: number) => {
//     if (currentApi == 0) { // webspeech
//         // return getWebSpeechRecognition();
//         throw new Error("Not implemented");
//     } else if (currentApi == 1) { // azure translation
//         testAzureTranslRecog(control, azure).then((result) => {
//             console.log(result);
//         });

//         // getAzureTranslRecog(control, azure).then((recognizer : sdk.TranslationRecognizer) => {
//         //     testAzureTranslRecog(recognizer);
//         // }, (error_str : string) => {
//         //     reject(error_str);
//         // });
//     } else {
//         throw(`Unexpcted API: ${currentApi}`);
//     }
// }

const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {
   // https://reactjs.org/docs/hooks-reference.html#usecallback
   // quote: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)."

   if (currentApi === API.WEBSPEECH) { // webspeech recognition
      return getWebSpeechRecog(control);
      // return useMemo(() => getWebSpeechRecog(control), []);
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return getAzureTranslRecog(control, azure);
      // return useMemo(() => getAzureTranslRecog(control, azure), []);
   } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationTranscriber
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
      // return useMemo(() => getWebSpeechRecog(control), []);
   }
}

/**
 * Connect the recognizer to the event handler
 * @param currentApi 
 * @param recognizer 
 * @returns Promsie<ScribeHandler>
 */
const runRecognition = (currentApi: number, recognizer : ScribeRecognizer, dispatch : React.Dispatch<any>) => new Promise<ScribeHandler>((resolve, reject) => {
   if (currentApi === 0) { // webspeech recognition event controller
      useWebSpeechRecog(recognizer as SpeechRecognition, dispatch)
         .then(() => {
            resolve(makeWebSpeechHandler(recognizer));            
         })
         .catch((error_str : string) => {
            reject(error_str);
         });
   } else if (currentApi === 1) { // azure recognition event controller
      reject("Azure Not implemented yet");
   } else {
      reject(`Unexpcted API_CODE: ${currentApi}`);
   }
});

/**
 * Called when the compoenent rerender.
 * Check current state, setup/start the recognizer if needed.
 * Always return the full transcripts, a function to reset the transcript,
 * and a function to change/handle recognizer (called in useEffect; when a api/listening change happens.).
 * 
 * Possible permutations of [ApiStatus, SRecognition, AzureStatus, ControlStatus]:
 * change can be monitored using useEffect or useCallback.
 * 1. first time call (recogStatus === null)
 *    - listening=false -> do nothing
 *    - listening=true -> start recognizer
 * 2. api change (called within a useEffect)
 *    - change recognizer and recogHandler, keep listening the same
 * 3. only listening change (called within a useEffect)
 *   - stop/pause recognizer
 * 
 * @param recog
 * @param api 
 * @param control 
 * @param azure 
 * 
 * @return transcripts, resetTranscript, recogHandler
 */
export const useRecognition = (sRecog : SRecognition, api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {


   const [recogHandler, setRecogHandler] = useState<ScribeHandler>();
   const [reseatTranscript, setResetTranscript] = useState<() => string>(() => () => dispatch('RESET_TRANSCRIPT'));
   const [lastChangeApiTime, setLastChangeApiTime] = useState<number>(Date.now());
   const dispatch = useDispatch();


   // change recognizer, if api changed
   useEffect(() => {
      getRecognition(api.currentApi, control, azure)
         .then((result : ScribeRecognizer) => {
            runRecognition(api.currentApi, result, dispatch)
               .then((handler : ScribeHandler) => {
                  setRecogHandler(() => handler);

                  let copy_sRecog = Object.assign({}, sRecog);
                  copy_sRecog.recognizer = result;
                  copy_sRecog.status = STATUS.AVAILABLE;
                  copy_sRecog.api = api.currentApi;

                  // // change handler
                  // console.log('recog changed', (sRecog.status === STATUS.NULL), (sRecog.status === STATUS.AVAILABLE), (control.listening));
                  if (control.listening) {
                     console.log(259, 'start recognition');
                     handler({type: 'START'}); // start recognition
                     copy_sRecog.status = STATUS.TRANSCRIBING;
                  }
                  
                  dispatch({ type: 'sRecog/set_recog', payload: copy_sRecog }); // only dispatch if it is fullfilled
               })
               .catch((error_str : string) => {
                  console.log(error_str);
               });
         })
         .catch((error_str : string) => {
            console.log(error_str);
         });
   }, [api.currentApi]);
   // control recognizer, if listening changed
   useEffect(() => {
      if (!recogHandler) {
         return;
      }
      if (control.listening) {
         recogHandler({type: 'START'});
      } else if (!control.listening) {
         recogHandler({type: 'STOP'});
      }
   }, [control.listening]);
   // restart recognizer, if status not ERROR
   useEffect(() => {
      // console.log('change recog status: ', sRecog.status);
      if (sRecog.status === STATUS.ENDED) {
         const curTime = Date.now();
         const timeSinceStart = curTime - lastChangeApiTime;
         // console.log(curTime, timeSinceStart);
         if (timeSinceStart > 1000 && control.listening) {
            // console.log(timeSinceStart, control.listening);
            if (recogHandler) recogHandler({type: 'START'});
            setLastChangeApiTime(curTime);
         }
      } else if (sRecog.status === STATUS.ERROR) {
         if (recogHandler) recogHandler({type: 'STOP'});
      }
   }, [sRecog.status]);


   const transcript : string = useSelector((state: RootState) => {
      const fullTranscript : string = state.TranscriptReducer.previousTranscript[0] 
                                       + ' ' + state.TranscriptReducer.currentTranscript[0];
      return fullTranscript;
   });


   return {transcript, recogHandler};
}
