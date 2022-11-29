import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition, Transcript,
   ScribeRecognizer, ScribeHandler, } from '../../react-redux&middleware/redux/typesImports';
import { API, STATUS } from '../../react-redux&middleware/redux/enumsImports';
import { RootState } from '../../store';

import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import  { getWebSpeechRecog, useWebSpeechRecog } from './web-speech/webSpeechRecog';
import { getAzureTranslRecog, testAzureTranslRecog, useAzureTranslRecog } from './azure/azureTranslRecog';
import { assert } from 'console';


// controls what api to send and what to do when error handling.

// NOTES: this needs to do everything I think. Handler should be returned which allows
//        event call like stop and the event should be returned... (maybe the recognition? idk.)

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
   const recogHandler : Function = handler(api.currentApi);


   return ({ useRecognition, recognition, recogHandler });
}

/**
 * Functions for controlling each API as they will be saved to this file.
 * 
 * @param currentApi 
 * @returns a handler function for the recognizer
 */
export const getHandler = (currentApi : number, recognizer : ScribeRecognizer) : ScribeHandler => {
   if (currentApi === API.WEBSPEECH) { // webspeech
      return useCallback((action) => {
         recognizer = recognizer as SpeechRecognition;
         switch (action.type) {
         case 'STOP':
            recognizer!.stop()
            break
         case 'START':
            recognizer!.start()
            break
         case 'ABORT':
            recognizer!.abort()
            break
         case 'CHANGE_LANGUAGE':
            recognizer.lang = action.payload
            break
         default:
            return "poggers";
         }
      }, [])
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return useCallback((action) => {
         recognizer = recognizer as sdk.TranslationRecognizer;
         switch (action.type) {
         case 'STOP':
            recognizer!.stopContinuousRecognitionAsync()
            break
         case 'START':
            recognizer!.startContinuousRecognitionAsync()
            break
         case 'ABORT':
            recognizer!.close()
            break
         case 'CHANGE_LANGUAGE':
            recognizer!.addTargetLanguage(action.payload)
            break
         default:
               return "poggers";
         }    
      }, [])
   } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationRecognizer
      throw new Error("Handler for ConversationTranscriber Not implemented");
   }
   else {
      throw new Error(`Unexpcted API: ${currentApi}`);
   }
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

export const getRecognition = (currentApi: number, control: ControlStatus, azure: AzureStatus) => {
   // https://reactjs.org/docs/hooks-reference.html#usecallback
   // quote: "useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)."

   if (currentApi === API.WEBSPEECH) { // webspeech recognition
      return useMemo(() => getWebSpeechRecog(control), []);
   } else if (currentApi === API.AZURE_TRANSLATION) { // azure TranslationRecognizer
      return useMemo(() => getAzureTranslRecog(control, azure), []);
   } else if (currentApi === API.AZURE_CONVERSATION) { // azure ConversationTranscriber
      throw new Error("Not implemented");
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
      // return useMemo(() => getWebSpeechRecog(control), []);
   }
}

export const makeRecognition = (currentApi: number) => {
   if (currentApi === 0) { // webspeech recognition event controller
      return { useWebSpeechRecog };
   } else if (currentApi === 1) { // azure recognition event controller
      return { useAzureTranslRecog };
   } else {
      throw new Error(`Unexpcted API_CODE: ${currentApi}`);
   }
}

// /**
//  * 
//  * @param currentApi 
//  * @returns a hook that returns {transcript, resetTranscript}
//  */
// export const useRecognition = (currentApi: number) => {
//    if (currentApi === 0) { // webspeech recognition event controller
//       return { useWebSpeechRecog };
//    } else if (currentApi === 1) { // azure recognition event controller
//       return { useAzureTranslRecog };
//    } else {
//       throw new Error(`Unexpcted API_CODE: ${currentApi}`);
//    }
// }

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

   if (api.currentApi !== API.WEBSPEECH) {
      throw new Error("Not implemented");
   }

   let copy_sRecog : SRecognition = Object.assign({}, sRecog);

   // reseatTranscript and recogHandler
   /***  ===**===  ^_^  ===**===  ~~!~~  ===**===  ^_^  ===*===  ***/
   // resetTranscript() is always initialized in the reducer
   // no need to memoize it
   const dispatch = useDispatch();
   const resetTranscript : () => string = sRecog.resetTranscript;

   // (setup) recognizer and recogHandler
   // handle uses the recognizer; so, if recognizer is null, handler is null.
   let recognizer : ScribeRecognizer = sRecog.recognizer;
   let recogHandler : ScribeHandler = sRecog.handler;
   if (recognizer === null) {
      assert(recogHandler === null);
      getRecognition(api.currentApi, control, azure).then((result : ScribeRecognizer) => {
         recognizer = result;
         recogHandler = getHandler(api.currentApi, recognizer);
      }, (error_str : string) => {
         console.log(error_str);
      });

      copy_sRecog.recognizer = recognizer;
      copy_sRecog.handler = recogHandler;
      copy_sRecog.status = STATUS.AVAILABLE;
      copy_sRecog.api = api.currentApi;
      // dispatch({
      //    type: 'SET_RECOG', 
      //    payload: { recog: recognizer, handler: recogHandler, status: STATUS.AVAILABLE, api: api.currentApi },
      // });
   }
   /***  ===**===  ^_^  ===**===  ~~!~~  ===**===  ^_^  ===*===  ***/

   // do nothing if the recognizer has already started successfully
   if (sRecog.status === STATUS.AVAILABLE) { // hasn't started yet
      const listening : boolean = control.listening;
      if (control.listening) { // start recognizer
         if (api.currentApi === API.WEBSPEECH) {
            // if successful, change copy_sRecog 
            useWebSpeechRecog(recognizer as SpeechRecognition).then((result : boolean) => {
               assert(result === true);
               copy_sRecog.status = STATUS.INPROGRESS;
            }, (error_str : string) => {
               console.log(error_str);
               copy_sRecog.status = STATUS.ERROR;
            });
         } else if (api.currentApi === API.AZURE_TRANSLATION) {
            throw new Error("Not implemented");
         } else if (api.currentApi === API.AZURE_CONVERSATION) {
            throw new Error("Not implemented");
         } else {
            throw new Error(`Unexpcted API_CODE: ${api.currentApi}`);
         }
      }
   }
   // if (sRecog.recognizer === null || sRecog.status === STATUS.NULL) {
   //    // first time call
   //    if (control.listening) {
   //       if (api.currentApi === API.WEBSPEECH) {
   //          // initialize the recognizer
   //          huseWebSpeechRecog(control, api).then((result : boolean) => {
   //             assert(result === true);
   //          }, (error_str) => { console.log(error_str) });
   //       }
   //    }
   // }

   dispatch({ type: 'SET_RECOG', payload: copy_sRecog });

   
   // get transcript with useSelector from TranscriptReducer
   const transcript : string = useSelector((state: RootState) => {
      const fullTranscript : string = state.TranscriptReducer.previousTranscript[0] 
                                       + ' ' + state.TranscriptReducer.currentTranscript[0];
      return fullTranscript;
   });


   return {transcript, resetTranscript, recogHandler};
}
