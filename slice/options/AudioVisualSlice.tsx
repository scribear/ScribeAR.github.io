
const nullFunction = () => {};
enum AZURE_STATUS {
    "CORRECT",
    "PENDING",
    "NULL"
}
const DEFAULT_KEY = "NULL";
const DEFAULT_REGION = "NULL";

const initialState = {
  azureKey: DEFAULT_KEY,
  azureRegion: DEFAULT_REGION,
  azureStatus: AZURE_STATUS.NULL
}


export default function azureReducer(state = initialState, action) {
  switch (action.type) {
    case 'SAVE_AZURE_OPTIONS':
        return {...state, ...action.payload};
    case 'CHANGE_AZURE_STATUS':
        return {...state, ...action.payload};
    default:
      return state;
  }
};
