import { DisplayStatus } from "../types";
enum COLOR {
  "BLACK",
  "WHITE",
}
const  initialState : DisplayStatus = {
  textSize: 6,
  primaryColor: '#0f0f0f',
  secondaryColor: "#292929",
  textColor: '#FFFFFF',
  menuVisible: true,
}

const saveLocally = (varName: string, value: any) => {
  localStorage.setItem(varName, JSON.stringify(value))
}

const getLocalState = (name: string) => {
  let checkNull = localStorage.getItem(name)
  if (checkNull) {
    return JSON.parse(checkNull);
  } else {
    return initialState
  }
};

export const DisplayReducer = (state = getLocalState("displayReducer2"), action) => {
  switch (action.type) {
    case 'CHANGE_PRIMARY_THEME':
      
      return {
        ...state,
        primaryColor: action.payload
      }
    case 'CHANGE_SECONDARY_THEME':
      return {
        ...state,
        secondaryColor: action.payload
      }
    case 'CHANGE_TEXT_COLOR':
      return {
        ...state,
        textColor: action.payload,
      }
    case 'SET_TEXT':
      saveLocally("displayReducer2", action.payload)
      return { ...state, ...action.payload };
    case 'HIDE_MENU':
      return {
        ...state,
        menuVisible: !state.menuVisible,
        };
    default:
      return state;
  }
}