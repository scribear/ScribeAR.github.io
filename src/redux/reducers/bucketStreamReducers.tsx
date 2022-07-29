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

/* Save to sessionStorage so that it is cleared when refreshed */

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

const saveSessionly = (varName: string, value: any) => {
    sessionStorage.setItem(varName, JSON.stringify(value));
}
  
const getSessionState = (varName: string) => {
    let checkNull = sessionStorage.getItem(varName)
    if (checkNull) {
        return JSON.parse(checkNull);
    } else {
        if (varName == "streams") {
            saveSessionly("streams", initialStreams);
            return initialStreams;
        }
    }
};
  
export const BucketStreamReducer = (state = getSessionState("streams"), action) => {
    switch (action.type) {
        case 'APPEND_AUDIOSTREAM':
            // // console.log(action.payload);
            // // console.log(action.payload == null);
            // // const newTextNode : TextNode = action.payload ? {time: action.payload.curTime, transcript: action.payload.transcript} : initialTextNode;
            // const newTextNode : TextNode = (action.payload)? action.payload : initialTextNode;
            // // console.log(newTextNode);
            // // console.log(action.payload);
            // // let copyState : AllText = Object.assign({}, state);
            // // copyState.push(newTextNode)

            // // saveSessionly("allText", action.payload)

            // return [ ...state, newTextNode ];
        
        case 'RESET_STREAMS':
            return { initialStreams };
        default:
            return state;
    }
}