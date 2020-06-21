import { combineReducers } from 'redux';

var savedTextSize = localStorage.getItem('text')
var choiceTextSize = 6
if (savedTextSize != null){
     choiceTextSize = savedTextSize
}

const submenuReducer = (state = 1, action) => {
     switch(action.type) {
          case 'SUBMENU_1':
               return 1;
          case 'SUBMENU_2':
               return 2;
          default: return state;
     }
}

const textSizeReducer = (state = choiceTextSize, action) => {
     switch (action.type) {
          case 'INCREMENT_TEXTSIZE':
               state++;
               return state;
          case 'DECREMENT_TEXTSIZE':
               return Math.max(1, state - 1);
          default:
               return state;
     }
}

const lineWidthReducer = (state = 10, action) => {
     switch (action.type) {
          case 'INCREMENT_LINEWIDTH':
               return Math.min(10, state + 1)
          case 'DECREMENT_LINEWIDTH':
               return Math.max(1, state - 1);
          default:
               return state;
     }
}

const numLinesReducer = (state = 35, action) => {
     switch (action.type) {
          case 'INCREMENT_NUMLINES':
               return Math.min(state + 1,40);
          case 'DECREMENT_NUMLINES':
               return Math.max(1, state - 1);
          default:
               return state;
     }
}

const lockScreenReducer = (state = false, action) => {
     if (action.type === 'FLIP_LOCKSCREEN')
          return !state;
     else return state;
}

const invertMicVisualReducer = (state = 0, action) => {
  if (action.type === 'FLIP_MICVISUAL'){
       state = state + 1;
       if (state == 4) {
            state = 0;
       }
  }
  return state;
}

const switchMenusReducer = (state = false, action) => {
     if (action.type === 'FLIP_SWITCHMENUS')
          return !state;
     else return state;
}

const invertColorsReducer = (state = false, action) => {
     if (action.type === 'FLIP_INVERTCOLORS')
          return !state;
     else return state;
}

const recordingReducer = (state = true, action) => {
     if (action.type === 'FLIP_RECORDING')
          return !state
     else return state
}

const recordingAzureReducer = (state = true, action) =>{
     if (action.type == 'FLIP_RECORDING_AZURE')
          return !state
     else return state
}

const switchToAzureReducer = (state = false, action) => {
     if (action.type == 'SWITCH_TO_AZURE_REDUCER')
          return !state
     else return state
}

const enteredKeyReducer = (state = false, action) =>{
     if (action.type == 'FLIP_ENTERED_KEY')
          return !state
     else return state
}

const correctAzureKeyReducer = (state = false, action) =>{
     if (action.type == 'FLIP_CORRECT_AZUREKEY')
          return !state
     else return state
}

const checkAzureKeyReducer = (state = false, action) =>{
     if (action.type == 'FLIP_CHECK_AZUREKEY')
          return !state
     else return state
}


const enteredRegionReducer = (state = false, action) =>{
     if (action.type == 'FLIP_ENTERED_REGION')
          return !state
     else return state
}

const instructionsReducer = (state = false, action) => {
     if (action.type == 'FLIP_INSTRUCTIONS')
          return !state
     else return state
}

const menuhideReducer = (state = false, action) => {
     if (action.type == 'FLIP_MENUHIDE')
          return !state
     else return state
}

const allReducers = combineReducers({
     switchToAzure: switchToAzureReducer,
     checkAzureKey: checkAzureKeyReducer,
     correctAzureKey: correctAzureKeyReducer,
     enteredRegion: enteredRegionReducer,
     enteredKey: enteredKeyReducer,
     textSize: textSizeReducer,
     lineWidth: lineWidthReducer,
     numLines: numLinesReducer,
     lockScreen: lockScreenReducer,
     invertColors: invertColorsReducer,
     recording: recordingReducer,
     mic: invertMicVisualReducer,
     switchMenus: switchMenusReducer,
     recordingAzure: recordingAzureReducer,
     ins: instructionsReducer,
     meh: menuhideReducer,
     submenu: submenuReducer,
});

export default allReducers;
