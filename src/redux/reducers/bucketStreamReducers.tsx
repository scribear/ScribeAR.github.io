import { 
    AudioEventBucket, 
    HTML5STTEventBucket, 
    AzureSTTEventBucket, 
    UserActionEventBucket, 
    AudioStream, 
    HTML5STTStream, 
    AzureSTTStream, 
    UserActionStream, 
    Streams 
} from "../types/bucketStreamTypes";

// ============================================== \\
const initialAudioStream : AudioStream = Array<AudioEventBucket>();
const initialHTML5STTStream : HTML5STTStream = Array<HTML5STTEventBucket>();
const initialAzureSTTStream : AzureSTTStream = Array<AzureSTTEventBucket>();
const initialUserActionStream : UserActionStream = Array<UserActionEventBucket>();

const initialStreams : Streams = {
    AudioStream: initialAudioStream,
    HTML5STTStream: initialHTML5STTStream,
    AzureSTTStream: initialAzureSTTStream,
    UserActionStream: initialUserActionStream,
}
// ============================================== \\

/* Save to sessionStorage so that it is cleared when refreshed */

const saveSessionly = (varName: string, value: any) => {
    sessionStorage.setItem(varName, JSON.stringify(value));
}
  
const getSessionState = (varName: string) => {
    let checkNull = sessionStorage.getItem(varName)
    if (checkNull) {
        return JSON.parse(checkNull);
    } else {
        if (varName === "streams") {
            saveSessionly("streams", initialStreams);
            return initialStreams;
        }
    }
};
  
// export const BucketStreamReducer = (state = getSessionState("streams"), action) => {
export const BucketStreamReducer = (state = initialStreams, action) => {
    switch (action.type) {
        case 'APPEND_AUDIOSTREAM':
            // make a AudioEventBucket; append it to state.AudioStream

            return
        case 'APPEND_HTML5_STT_STREAM':
            // make a HTML5STTEventBucket; append it to state.HTML5STTStream
            // console.log(53, "type: ", typeof action.payload, "; value: ", action.payload)
            return state;
        case 'APPEND_AZURE_STT_STREAM':
            // make a AzureTTEventBucket; append it to state.AzureSTTStream

            return
        case 'APPEND_USER_ACTION_STREAM':
            // make a UserActionStream; append it to state.UserActionStream

            return
        case 'RESET_STREAMS':
            return { initialStreams };
        default:
            return state;
    }
}