import { DisplayStatus } from "../typesImports";
enum COLOR {
  "BLACK",
  "WHITE",
}
const  initialState : DisplayStatus = {
  textSize: 4,
  primaryColor: '#0f0f0f',
  secondaryColor: "#292929",
  textColor: '#FFFFFF',
  menuVisible: true,
  rowNum: 4,
  linePos: 8,
}

const saveLocally = (varName: string, value: any) => {
  localStorage.setItem(varName, JSON.stringify(value));
}

/**
 * TO DO LATER
 * Add more try catches.
 * The local storage could possibly contain garbage that would crash everything. Should prevent this from happening.
 */
const getLocalState = (name: string) => {
  let localState = localStorage.getItem(name);
  
  // localStorage displayReducer2 exists
  if (localState) {
    console.log("localStorage current state:", localState);
    // displayReducer is valid JSON object string form
    try {
      let state = JSON.parse(localState);
      // state is the JSON object version
      return state;
    } catch (error) {
      console.log("localStorage not JSON string:", localState);
    }
  }
  console.log("localStorage using inital state:", initialState);
  return initialState;
};

export const DisplayReducer = (state = getLocalState("displayReducer2"), action) => {
  let new_state;
  switch (action.type) {
    case 'CHANGE_PRIMARY_THEME':
      new_state = {
        ...state, 
        primaryColor: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;

    case 'CHANGE_SECONDARY_THEME':
      new_state = {
        ...state, 
        secondaryColor: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;

    case 'CHANGE_TEXT_COLOR':
      new_state = {
        ...state, 
        textColor: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;

    case 'SET_TEXT':
      new_state = {
        ...state, 
        textSize: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;

    case 'SET_ROW_NUM':
      new_state = {
        ...state, 
        rowNum: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;

    case 'SET_POS':
      new_state = {
        ...state, 
        linePos: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;
  
    case 'HIDE_MENU':
      return {
        ...state,
        menuVisible: !state.menuVisible,
        };
    default:
      return state;
  }
}