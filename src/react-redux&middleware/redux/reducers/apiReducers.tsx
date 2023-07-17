import { ApiStatus, AzureStatus, PhraseList, PhraseListStatus } from "../typesImports";
import { API, STATUS } from '../types/apiEnums';
import { WhisperStatus } from "../types/apiTypes";


const initialAPIStatusState: ApiStatus = {
  currentApi: API.WEBSPEECH,
  webspeechStatus: STATUS.AVAILABLE,
  azureTranslStatus: STATUS.AVAILABLE,
  azureConvoStatus: STATUS.AVAILABLE,
  whisperStatus: STATUS.AVAILABLE,
}

const initialPhraseList: PhraseList = {
  phrases: [],
  name: "None",
  availableSpace: -1
}

const initialPhraseListState: PhraseListStatus = {
  currentPhraseList: initialPhraseList,
  phraseListMap: new Map<string, PhraseList>()
}

const initialAzureState: AzureStatus = {
  azureKey: "Enter",
  azureRegion: "Enter",
  phrases: [""]
}

const initialWhisperState: WhisperStatus = {
  whiserPhrases: "",
  tinyModel: "tiny (75 MB)",
  baseModel: "base (145 MB)"
}

const saveLocally = (varName: string, value: any) => {
  localStorage.setItem(varName, JSON.stringify(value))
}

const getLocalState = (name: string) => {
  let checkNull = localStorage.getItem(name)
  if (checkNull) {
    return JSON.parse(checkNull);
  } else {
    if (name == "apiStatus") {
      return initialAPIStatusState
    } else if (name == "azureStatus") {
      return initialAzureState
    } else if (name == "whisperStatus") {
      return initialWhisperState
    }
  }
};

export const APIStatusReducer = (state = getLocalState("apiStatus"), action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_API': // never called
      return { ...state, ...action.payload };
    case 'CHANGE_API_STATUS':
      if (action.payload.azureTranslStatus == STATUS.AVAILABLE || action.payload.currentApi !== state.currentApi) {
        saveLocally("apiStatus", action.payload);
      }
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AzureReducer = (state = getLocalState("azureStatus"), action) => {
  switch (action.type) {
    case 'CHANGE_AZURE_LOGIN':
      return { ...state, ...action.payload };
    case 'CHANGE_AZURE_STATUS':
      return { ...state, ...action.payload };
    case 'CHANGE_LIST':
      return { ...state, 
               phrases: action.payload }
    default:
      return state;
  }
}

export const WhisperReducer = (state = getLocalState("whisperStatus"), action) => {
  return state;
}

export const PhraseListReducer = (state = initialPhraseListState, action) => {
  switch (action.type) {
    case 'ADD_PHRASE_LIST':
      let newListName = action.payload.name
      let iterator = 1;
      while (state.phraseListMap.has(newListName)) {
        newListName = action.payload.name + iterator
        iterator++;
      }
      let newPhraseList: PhraseList = {
        phrases: [],
        name: newListName,
        availableSpace: action.payload.availableSpace,
      }
      state.phraseListMap.set(newListName, newPhraseList)
      return {
        ...state,
        currentPhraseList: newPhraseList,
      }
    case 'CHANGE_PHRASE_LIST':
      return {
        ...state,
        currentPhraseList: action.payload,
      }
    case 'DELETE_PHRASE_LIST':
      state.phraseListMap.delete(action.payload)
      if (state.currentPhraseList.name == action.payload) {
        return {
          ...state,
          currentPhraseList: initialPhraseList,
        }
      } else {
        return {
          ...state,
        }
      }
    case 'EDIT_PHRASE_LIST':     
      return { ...state,
               currentPhraseList: action.payload}
    // existing cases
    case 'SET_FILE_CONTENT':     
      return { ...state,
               fileContent: action.payload}
    default:
      return state;
  }
}





