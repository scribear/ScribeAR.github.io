import { Speaker, Transcript, AllSpeakerTranscript } from "../types";

enum S_STATUS {
    "NORMAL", // or "N", // normal
    "MUTED", // or "M", // muted but connected
    "DISCONNECTED", // or "D" // disconnected
    "LAGGING"
}
enum S_ROLE {
    "HOST", // or "TEACHER"
    "GUEST" // or "STUDENT"
}

// ==============================================
const initialSpeaker: Speaker = {
    speakerId: "Unamed",
    status: S_STATUS.NORMAL, // maybe we can use char
    role: S_ROLE.HOST
}

const initialTranscript: Transcript = {
    // text: new Map<number, string>([[Number(0), ""]]),
    text: Array([0, ""]),
    lastTime: -1
}

const initial_speaker_transcript = new Map<string, Transcript>();
initial_speaker_transcript.set(
    initialSpeaker.speakerId, initialTranscript
)
// console.log("hs", initial_speaker_transcript)

// function h () {
//     var cur_time = (new Date()).getTime();
//     var initial_text = new Map();
//     initial_text.set(cur_time, "");
//     const initialTranscript: Transcript = {
//         text: initial_text,
//         lastTime: cur_time
//     }

//     const initial_speaker_transcript = new Map<string, Transcript>();
//     initial_speaker_transcript.set(
//         initialSpeaker.speakerId, initialTranscript
//     )

//     console.log("here")
//     console.log(initial_speaker_transcript)
//     return initial_speaker_transcript;
// }

const initialAllSpeakerTranscript: AllSpeakerTranscript = {
    allSpeakers: [initialSpeaker],
    maxSpeaker: 2,

    speakerTranscript: initial_speaker_transcript,
    lastUpdateTime: 0
    // speakerTranscript: new Map<string, Transcript>([[initialSpeaker.speakerId, initialTranscript]]),
    // transcript: initialTranscript

    // speakerTranscript: initial_speaker_transcript
}

// console.log("right after", initialAllSpeakerTranscript)

// ==============================================

const saveLocally = (varName: string, value: any) => {
    if (varName == "speakerTranscript") {
        /* 
            we have to serialize it seperately
            {
                allSpeakers: Speaker[]
                maxSpeaker: number
                speakerTranscript: Map<Speaker["speakerId"], Transcript>
            }
        */
    //    console.log(78, value)
        var copyData = Object.assign({}, value);
        copyData.speakerTranscript = Array.from(value.speakerTranscript.entries());
        // copyData.speakerTranscript.forEach(transcript => {
        //     Array.from(transcript[1].text).forEach(text_map_array => {
        //         transcript[1].text = text_map_array
        //     });
        // });
        // console.log("In saveLocally: ", copyData)

        localStorage.setItem(varName, JSON.stringify(copyData));
    } else {
        localStorage.setItem(varName, JSON.stringify(value))
    }
}
saveLocally("speakerTranscript", initialAllSpeakerTranscript)
  
const getLocalState = (varName: string) => { // assume varName == speakerTranscript
    let checkNull = localStorage.getItem(varName)
    if (checkNull) {
        var stringData = JSON.parse(checkNull);
        // console.log("before", stringData);
        stringData.speakerTranscript = new Map(stringData.speakerTranscript);
        // console.log(stringData.speakerTranscript)
        // console.log("In getLocalState: stringData", stringData);
        // console.log("Final", stringData.speakerTranscript.get("Unamed").text.get(0))
        return stringData;
    } else {
        console.log("get initial speaker transcripts");
        return initialAllSpeakerTranscript;
    }
};
  
export const SpeakerTranscriptReducer = (state = getLocalState("speakerTranscript"), action) => {
// export const SpeakerTranscriptReducer = (state = initialAllSpeakerTranscript, action) => {
    switch (action.type) {
        case 'ADD_SPEAKER': // add default speaker for now
            // will not be called yet
            return { ...state};
        case 'APPEND_TEXT':
            // console.log("In APPEND_TEXT: ", state)
            // let speaker_id = action.payload.speakerId
            // let spaker_last_time = (state.speakerTranscript.get(speaker_id)).lastTime
            // var new_state = {...state, lastUpdateTime: action.payload.curTime}
            // // console.log("state copy: ", new_state)
            // if ((action.payload.curTime - spaker_last_time) >= 60) { // difference greater than 1 minute
            //     (new_state.speakerTranscript.get(speaker_id)).text.push([action.payload.curTime, action.payload.text]);
            //     (new_state.speakerTranscript.get(speaker_id)).lastTime = action.payload.curTime;
            // } else {
            //     let text_arr_ref = new_state.speakerTranscript.get(speaker_id).text;
            //     let last_element_ref = (text_arr_ref[text_arr_ref.length - 1])
            //     // var cur_text = text_arr_ref.get(spaker_last_time);
            //     var cur_text = last_element_ref[1]
            //     cur_text += action.payload.text;
            //     last_element_ref[1] = cur_text;
            //     // (new_state.speakerTranscript.get(speaker_id)).text.set(spaker_last_time, cur_text);
            // }
            // // console.log(134, "after APPEND_TEXT: ", new_state)
            // saveLocally("speakerTranscript", new_state)
            // return new_state
            return
        case 'CHANGE_MAX_SPEAKER':
            return { ...state};
        case 'NEW_APPEND':
            let cur_speaker_id = action.payload.speakerId
            var new_state = {...state, lastUpdateTime: action.payload.curTime}
            if (new_state.speakerTranscript.get(cur_speaker_id).text[0] == [0, ""]) {
                new_state.speakerTranscript.get(cur_speaker_id).text = [action.payload.curTime, action.payload.final]
            } else {
                new_state.speakerTranscript.get(cur_speaker_id).text.push([action.payload.curTime, action.payload.final])
            }
            // new_state.speakerTranscript.set(cur_speaker_id, action.payload.transcript)
            saveLocally("speakerTranscript", new_state)
            return new_state
        default:
            // console.log("In Speaker reducer, default", state)
            // var copy_state = Object.assign({}, state);
            // console.log("In default reducer")
            // saveLocally("speakerTranscript", state)
            // var saved_state = getLocalState("speakerTranscript");
            // console.log("saved_state: ", saved_state)
            // console.log("copy_state: ", copy_state)
            return { ...state};
    }
} 