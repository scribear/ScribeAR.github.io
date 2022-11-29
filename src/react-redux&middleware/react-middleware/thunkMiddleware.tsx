import { batch } from "react-redux";

import { MainStreamMap } from "../redux/types/bucketStreamTypes";


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

// Write a synchronous outer function that receives the `text` parameter:
export function makeEventBucket(object: BucketArgs) {
    const stream = object.stream;
    const value = object.value;

    // And then creates and returns the async thunk function:
    return async function makeEventBucketThunk(dispatch, getState) {
        // ✅ Now we can use the stream value
        if (stream === 'audio') { 
            const curTime = Date.now();

        } else if (stream === 'html5') {
            // console.log("haha, wee?~!", value.length);
            const curTime = Date.now();

            // Array are type <TranscriptConfidence>
            let finalArr = Array<SpeechRecognitionAlternative>();
            let notFinalArr = Array<SpeechRecognitionAlternative>();

            for (let i = 0; i < value.length; i++) {
                const speechResult = value[i];
                if (speechResult.isFinal) { // final
                    finalArr.push(speechResult[0]);
                } else { // not final
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
                    newMainStream: newMainStream
                });
                dispatch({
                    type: 'RECOGNIZED',
                    payload: {fArr: finalArr, nfArr: notFinalArr},
                });
            });
        } else if (stream === 'azure') {
    
        } else if (stream === 'userAction') {
    
        }

        // dispatch({ type: 'todos/todoAdded', payload: response.todo })
    }
}