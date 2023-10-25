import { DisplayStatus } from "../typesImports";
enum COLOR {
  "BLACK",
  "WHITE",
}
const  initialState : DisplayStatus = {
  textSize: 4,
  primaryColor: '#000000',
  secondaryColor: "#8b0000",
  textColor: '#ffff00',
  menuVisible: true,
  rowNum: 4,
  linePos: 8,
  wordSpacing: 5,
}

const saveLocally = (varName: string, value: any) => {
  localStorage.setItem(varName, JSON.stringify(value));
}


const getLocalState = (name: string) => {
  let localState = localStorage.getItem(name);
  
  // localStorage displayReducer2 exists
  if (localState) {
    console.log("localStorage-display current state:", localState);
    // displayReducer is valid JSON object string form
    try {
      let state = JSON.parse(localState);
      let length = Object.keys(state).length;
      // there are currently 8 attributes for the localStorage-display
      if (length !== 8) {
          console.log("localStorage-display not correct length:", localState);
          console.log("localStorage-display using inital state:", initialState);
          saveLocally("displayReducer2", initialState);
          return initialState;
        }
      // state is the JSON object version with correct length
      return state;
    } catch (error) {
      console.log("localStorage-display not JSON string:", localState);
    }
  }
  console.log("localStorage-display using inital state:", initialState);
  saveLocally("displayReducer2", initialState);
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

    case 'SET_WORD_SPACING':
      new_state = {
        ...state, 
        wordSpacing: action.payload };
      saveLocally("displayReducer2", new_state)
      return new_state;
  
    case 'HIDE_MENU':
      new_state = {
        ...state, 
        menuVisible: !state.menuVisible };
      saveLocally("displayReducer2", new_state)
      return new_state;
      // return {
      //   ...state,
      //   menuVisible: !state.menuVisible,
      //   };
    default:
      return state;
  }
}