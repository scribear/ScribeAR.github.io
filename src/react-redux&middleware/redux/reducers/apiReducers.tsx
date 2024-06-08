import { API, STATUS } from '../types/apiEnums';
import { ApiStatus, AzureStatus, PhraseList, PhraseListStatus } from "../typesImports";
import { StreamTextStatus, WhisperStatus,ScribearServerState } from "../types/apiTypes";

const initialAPIStatusState: ApiStatus = {
  currentApi: API.WEBSPEECH,
  webspeechStatus: STATUS.TRANSCRIBING,
  azureTranslStatus: STATUS.AVAILABLE,
  azureConvoStatus: STATUS.AVAILABLE,
  whisperStatus: STATUS.AVAILABLE,
  streamTextStatus: STATUS.AVAILABLE,
  scribearServerStatus : STATUS.AVAILABLE,
}

const initialPhraseList: PhraseList = {
  phrases: [],
  name: "None",
  availableSpace: -1,
  pushed_option: "scribeAR"   // new
}

const initialPhraseListState: PhraseListStatus = {
  currentPhraseList: initialPhraseList,
  phraseListMap: new Map<string, PhraseList>()
}

const initialAzureState: AzureStatus = {
  azureKey: "",
  azureRegion: "",
  phrases: [""]
}

const initialWhisperState: WhisperStatus = {
  whisperPhrases: "",
  tinyModel: "tiny (75 MB)",
  baseModel: "base (145 MB)"
}

const initialStreamTextState: StreamTextStatus = {
  streamTextEvent: "",
  startPosition: -1,
}

const initialScribearServerState: ScribearServerState = {

}

const saveLocally = (varName: string, value: any) => {
  localStorage.setItem(varName, JSON.stringify(value))
  return value;
}

// Try to retrieve state values saved into local storage in previous sessions
const getLocalState = (name: string) => {
  let stateJson = localStorage.getItem(name);
  if (stateJson) {
    console.log("Retrived state from local storage:", name, stateJson);
    try {
      let state: {} = JSON.parse(stateJson);
      // Checking shape of apiStatus object, currently disabled
      // if (length !== 5) {
      //   console.log("localStorage-api not correct length:", localState);
      //   console.log("localStorage-api using inital state:", initialAPIStatusState);
      //   saveLocally("apiStatus", initialAPIStatusState);
      //   return initialAPIStatusState;
      // }
      return state;
    } catch (error) {
      console.log("State retrieved from local storage " + name + " cannot be deserialized");
    }
  }
  // Else we save initial state values into local storage
  if (name === "apiStatus") {
    return saveLocally("apiStatus", initialAPIStatusState);
  } else if (name === "azureStatus") {
    return saveLocally("azureStatus", initialAzureState);
  } else if (name === "whisperStatus") {
    return saveLocally("whisperStatus", initialWhisperState);
  } else if (name === "streamTextStatus") {
    return saveLocally("streamTextStatus", initialStreamTextState);
  } else if (name === "scribearServerStatus") {
    return saveLocally("scribearServerStatus", initialScribearServerState);
  }
  return {} ;
};

export const APIStatusReducer = (state = getLocalState("apiStatus") as ApiStatus, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_API': // never called
      return { ...state, ...action.payload };
    case 'CHANGE_API_STATUS':
      if (action.payload.azureTranslStatus === STATUS.AVAILABLE || action.payload.currentApi !== state.currentApi) {
        saveLocally("apiStatus", action.payload);
      }
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AzureReducer = (state = getLocalState("azureStatus") , action) => {
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

export const StreamTextReducer = (state = getLocalState("streamTextStatus"), action) => {
  switch(action.type) {
    case 'CHANGE_STREAMTEXT_STATUS':
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}
export const ScribearServerReducer = (state = getLocalState("whisperStatus"), action) => {
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
        pushed_option: action.payload.pushed_option || "",  // new
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
      if (state.currentPhraseList.name === action.payload) {
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
    case 'SET_PHRASE_OPTION_TO_CUSTOM': {
      const newPhraseListMap = new Map(state.phraseListMap);
      const phraseData: PhraseList = newPhraseListMap.get(action.payload.phraseName) || {
        phrases: [],
        name: action.payload.phraseName || "None",
        availableSpace: -1,
        pushed_option: "default"
      };
      phraseData.pushed_option = 'custom';
      newPhraseListMap.set(action.payload.phraseName, { ...phraseData });
      return {
        ...state,
        phraseListMap: newPhraseListMap,
      };
    }
    default:
      return state;
  }
}
