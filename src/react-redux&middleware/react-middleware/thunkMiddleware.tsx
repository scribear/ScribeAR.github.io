import { batch } from "react-redux";

import { MainStreamMap } from "../redux/types/bucketStreamTypes";
import { ControlStatus, STATUS, StatusType } from "../redux/typesImports";


/* Save to sessionStorage so that it is cleared when refreshed */
const saveSessionly = (varName: string, value: any) => {
   sessionStorage.setItem(varName, JSON.stringify(value));
   // if (varName === 'audio') {

   // } else if (varName === 'html5STT') {

   // } else if (varName === 'AzureSTT') {

   // } else if (varName === 'UserAction') {

   // }
}

const getSessionState = (varName: string) => {
   let checkNull = sessionStorage.getItem(varName)
   if (checkNull) {
      return JSON.parse(checkNull);
   } else {
      // if (varName === "streams") {
      //     const mainStreamMap = defaultMainStreamMap();
      //     saveSessionly("streams", mainStreamMap);
      //     return mainStreamMap;
      // }
   }
};
type BucketArgs = {
   stream: string,
   value: any | SpeechRecognitionResultList,
}

/**
 * Write a synchronous outer function that receives the `text` parameter:
 * @param object 
 * @returns 
 */
export function makeEventBucket(object: BucketArgs) {
   const stream = object.stream;
   const value = object.value;

   // And then creates and returns the async thunk function:
   return async function makeEventBucketThunk(dispatch : React.Dispatch<any>, getState) {
      // ✅ Now we can use the stream value
      if (stream === 'audio') { 
         const curTime = Date.now();
      } else if (stream === 'html5') {
         // console.log("haha, wee?~!", value.length);
         const curTime = Date.now();

         let finalArr = Array<SpeechRecognitionAlternative>();
         let notFinalArr = Array<SpeechRecognitionAlternative>();
         for (let i = 0; i < (value as SpeechRecognitionResultList).length; i++) {
            const speechResult : SpeechRecognitionResult = value[i];
            if (speechResult.isFinal) {
               finalArr.push(speechResult[0]);
            } else {
               notFinalArr.push(speechResult[0]);
            }
         }

         const streamMap : MainStreamMap = await getState().BucketStreamReducer;
         let newMainStream : boolean = false;
         // If elapsed
         if (streamMap.curMSST + streamMap.timeInterval <= curTime) {
               newMainStream = true;

               // Also append final transcripts to sessionStorage

               // const curSessionSpeech = getSessionState('html5STT');
               // const finalSpeech = finalArr.map(fSpeech => fSpeech.transcript).join('');
               // saveSessionly('html5STT', curSessionSpeech + finalSpeech);
               console.log("New html5 stream created; sessionStorage updated!");
         }

         // console.log({
         //     type: 'APPEND_HTML5_STT_STREAM', 
         //     payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
         //     newMainStream: newMainStream
         // });
         batch(() => {
            dispatch({
               type: 'APPEND_HTML5_STT_STREAM', 
               payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
               newMainStream: newMainStream,
            });
            dispatch({
               type: 'transcript/recognized',
               payload: {fArr: finalArr, nfArr: notFinalArr},
            });
         });
      } else if (stream === 'azure') {
   
      } else if (stream === 'userAction') {
   
      }

      // dispatch({ type: 'todos/todoAdded', payload: response.todo })
   }
}


// /**
//  * For onend() event
//  * @returns 
//  */
// export function makeTranscriptEnd(stream : string) {

//    return async function makeTranscriptEndThunk(dispatch : React.Dispatch<any>, getState) {
//       batch(() => {
//          dispatch({ type: 'transcript/end' });
//          dispatch({ type: 'sRecog/set_status', payload: STATUS.ENDED})
//       });
//    }
// }

// /**
//  * for end and error events of both webspeech and azure
//  * 
//  * @rationale when an error occurs, both end and error event are fired
//  * and I am not sure which one is fired first.
//  * However, for end event,
//  * as long as we check the status was not error,
//  * then we can make sure an error stays as an error.
//  * @param type 
//  * @returns 
//  */
// export function makeEndErrorHanlder(type : string) {

//    if (type === 'end') {
//       return async function recogEndThunk(dispatch : React.Dispatch<any>, getState) {
//          const recogStatus : StatusType = await getState().sRecogReducer.status;
//          if (recogStatus === STATUS.ERROR) {
//             dispatch({ type: 'transcript/end' });
//          } else { // not error
//             batch(() => {
//                dispatch({ type: 'transcript/end' });
//                dispatch({ type: 'sRecog/set_status', payload: STATUS.ENDED });
//             });
//          }
//       }
//    } else if (type === 'error') {
//       return async function recogErrorThunk(dispatch : React.Dispatch<any>, getState) {
//          batch(() => {
//             dispatch({ type: 'transcript/end' });
//             dispatch({ type: 'sRecog/set_status', payload: STATUS.ERROR });
//          });
//       }
//    }
// } 