import { ControlStatus } from "../types";

const initialControlState : ControlStatus = {
    listening: true,
    speechLanguage: {label: "English (United States)",	CountryCode: "en-US"},
    textLanguage: {label: "English",	CountryCode: "en"},
    showFrequency: false,
    showLabels: true,
    showTimeData: false,
}

export function ControlReducer(state = initialControlState, action) {
  switch (action.type) {
    case 'FLIP_RECORDING':
      return { ...state, ...action.payload};
    case 'FLIP_SHOWFREQ':
      return { ...state, showFrequency: !state.showFrequency};
    case 'FLIP_SHOWLABELS':
      return { ...state, showLabels: !state.showLabels};
    case 'FLIP_SHOWTIMEDATA':
      return { ...state, showTimeData: !state.showTimeData};
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
        textLanguage: action.payload};
    default:
      return state;
  }
}