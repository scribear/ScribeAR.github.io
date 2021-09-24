enum APIS {
    "WEBSPEECH",
    "AZURE",
    "STREAMTEXT"
}

enum STATUS {
    "AVAILABLE",
    "NULL",
    "UNAVAILABLE"
}

const initialState = {
  currentAPI: APIS.WEBSPEECH,
  webspeechStatus: STATUS.AVAILABLE,
  azureStatus: STATUS.NULL,
  streamtextStatus: STATUS.NULL
  
}

export default function apiReducer(state = initialState, action) {
    switch (action.type) {
      case 'CHANGE_CURRENT_API':
        return {...state, ...action.payload};
      case 'CHANGE_API_STATUS':
        return {...state, ...action.payload};
      default:
        return state;
    }
};
