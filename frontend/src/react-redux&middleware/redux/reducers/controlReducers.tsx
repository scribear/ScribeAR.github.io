import { ControlStatus } from "../typesImports";


const saveSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
}

// const loadSessionStorage = (key: string) => {
//   const value = sessionStorage.getItem(key);
//   if (value) {
//     return JSON.parse(value);
//   }
//   return null;
// }

const initialControlState : ControlStatus = {
  listening: true,
  speechLanguage: {label: "English (United States)",	CountryCode: "en-US"},
  textLanguage: {label: "English",	CountryCode: "en"},
  showFrequency: false,
  showTimeData: false,
  showMFCC: false,
  showSpeaker: false,
  showIntent: false,
}

export function ControlReducer(state = initialControlState, action) {
  switch (action.type) {
    case 'FLIP_RECORDING':
      saveSessionStorage('listening', action.payload.listening === true);
      return { ...state, ...action.payload};
    case 'FLIP_SHOWFREQ': // also set showTimeData false
      return { ...state, showFrequency: !state.showFrequency, showTimeData: false, showMFCC: false };
    case 'FLIP_SHOWTIMEDATA': // also set showFrequency false
      return { ...state, showFrequency: false, showTimeData: !state.showTimeData, showMFCC: false };
    case 'FLIP_SHOWMFCC':
      return { ...state, showFrequency: false, showTimeData: false, showMFCC: !state.showMFCC };
    case 'control/flip_showSpeaker':
      return { ...state, showSpeaker: !state.showSpeaker };
    case 'control/flip_showIntent':
      return { ...state, showIntent: !state.showIntent };
    case 'FLIP_RECORDING_PHRASE':
      return { ...state, listening: action.payload};
    case 'SET_SPEECH_LANGUAGE':
        return {
          ...state,
          speechLanguage: action.payload
        };
    case 'SET_TEXT_LANGUAGE':
        return {
          ...state,
          textLanguage: action.payload
        };
    default:
      return state;
  }
}
