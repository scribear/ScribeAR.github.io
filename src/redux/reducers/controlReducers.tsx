import { ControlStatus } from "../types";

const initialControlState : ControlStatus = {
    listening: true,
    speechLanguage: "en-US",
    textLanguage: "en"
}

export function ControlReducer(state = initialControlState, action) {
  switch (action.type) {
    case 'FLIP_RECORDING':
      return { ...state, ...action.payload};
    case 'FLIP_RECORDING_PHRASE':
      return { ...state,
              listening: action.payload};
    case 'SET_SPEECH_LANGUAGE':
        return {
          ...state,
          speechLanguage: action.payload};
    case 'SET_TEXT_LANGUAGE':
        return {
          ...state,
        speechLanguage: action.payload};
    default:
      return state;
  }
}