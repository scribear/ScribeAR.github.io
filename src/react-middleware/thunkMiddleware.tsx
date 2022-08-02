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
            // console.log("haha, wee?~!", value.length);
            const streams : any = await getState().BucketStreamReducer;

            let empty : boolean = false;
            // Unless empty array, we always finish the last eventBucket,
            // then append a new one 
            if (streams.HTML5STTStream.length == 0) {
                empty = true;
            }

            // console.log(store.getState().BucketStreamReducer);
            const curTime = Date.now();

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

            console.log({
                type: 'APPEND_HTML5_STT_STREAM', 
                payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
                streamEmpty: empty
            });
            dispatch({
                type: 'APPEND_HTML5_STT_STREAM', 
                payload: {curTime: curTime, fArr: finalArr, nfArr: notFinalArr}, 
                streamEmpty: empty
            });
        } else if (stream === 'azure') {
    
        } else if (stream === 'userAction') {
    
        }

        // dispatch({ type: 'todos/todoAdded', payload: response.todo })
    }
}