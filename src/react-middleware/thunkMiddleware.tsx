import { MainStreamMap } from "../redux/types/bucketStreamTypes";

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

        } else if (stream === 'html5') {
            const curTime = Date.now();

            // console.log("haha, wee?~!", value.length);
            const streamMap : MainStreamMap = await getState().BucketStreamReducer;

            let newMainStream : boolean = false;
            // If elapsed
            if (streamMap.curMSST + streamMap.timeInterval <= curTime) {
                newMainStream = true;
            }

            // Array are type <TranscriptConfidence>
            let finalArr = Array<SpeechRecognitionAlternative>();
            let notFinalArr = Array<SpeechRecognitionAlternative>();

            for (let i = 0; i < value.length; i++) {
                const speechResult = value[i];
                if (speechResult.isFinal) {
                    // console.log("is final");
                    // finalArr.push({transcript: value, confidence: number,})
                    finalArr.push(speechResult[0]);
                } else {
                    notFinalArr.push(speechResult[0]);
                }
            }

            // console.log({
            //     type: 'APPEND_HTML5_STT_STREAM', 
            //     payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
            //     newMainStream: newMainStream
            // });
            dispatch({
                type: 'APPEND_HTML5_STT_STREAM', 
                payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
                newMainStream: newMainStream
            });
        } else if (stream === 'azure') {
    
        } else if (stream === 'userAction') {
    
        }

        // dispatch({ type: 'todos/todoAdded', payload: response.todo })
    }
}