import { combineReducers } from 'redux';

var savedTextSize = localStorage.getItem('text')
var savedColor = localStorage.getItem('color')
var savedBox = localStorage.getItem('box')
var savedMeh = localStorage.getItem('meh')

var choiceColor = 0//0 = black; 1 = white
var choiceMeh = 0
var choiceBox = 40
var choiceTextSize = 6
if (savedTextSize != null){
     choiceTextSize = savedTextSize
}
if (savedMeh != null){
     choiceMeh = savedMeh
}
if (savedBox != null){
     choiceBox = savedBox
}
if (savedColor != null){
      choiceColor = savedColor 
}

const submenuReducer = (state = 1, action) => {
     switch(action.type) {
          case 'SUBMENU_1':
               return 1;
          case 'SUBMENU_2':
               return 2;
          case 'SUBMENU_3' :
               return 3;
          case 'NEXT_PAGE':
               return Math.min(3,state+1);
          case 'PREV_PAGE':
               return Math.max(1,state-1);
          default: return state;
     }
}

const azureSwitchReducer = (state = 1, action)=>{
     switch(action.type){
          case 'NEXT_AZURE':
               return Math.min(2,state+1);
          case 'PREV_AZURE':
               return Math.max(1,state-1);
          default: return state;
     }
}

const textSizeReducer = (state = choiceTextSize, action) => {
     switch (action.type) {
          case 'INCREMENT_TEXTSIZE':
               return state%12 + 1;
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

const numLinesReducer = (state = choiceBox, action) => {
     switch (action.type) {
          case 'INCREMENT_NUMLINES':
               return Math.min(state + 1,50);
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



const switchMenusReducer = (state = false, action) => {
     if (action.type === 'FLIP_SWITCHMENUS')
          return !state;
     else return state;
}

const invertColorsReducer = (state = choiceColor, action) => {
     if (action.type === 'FLIP_INVERTCOLORS')
          return (state + 1)%2;
     if (action.type === 'PICK_BLACK')
          return 0;
     if (action.type === 'PICK_WHITE')
          return 1;
     else return state ;
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

const menuhideReducer = (state = choiceMeh, action) => {
     if (action.type == 'FLIP_MENUHIDE')
          return (state+1)%2
     else return state
}

const invertStereo = (state = 0, action) =>{
     if(action.type === 'FLIP_STEREO')
          return !state;
     else return state;
}

const invertStereoVisualReducer = (state = 0, action) =>{
     switch (action.type) {
          case 'FORWARD_STEREOVISUAL':
              return (state + 1)%4;
          case 'BACKWARD_STEREOVISUAL':
               state = state -1;
               if(state < 0){
                    state = 3
               }
               return state;
           default:
                return state;
     }
}

const invertMicVisualReducer = (state = 0, action) => {
     switch (action.type) {
          case 'FORWARD_MICVISUAL':
              return (state + 1)%4;
          case 'BACKWARD_MICVISUAL':
               state = state -1;
               if(state < 0){
                    state = 3
               }
               return state;
           default:
                return state;
     }
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
     steromic: invertStereoVisualReducer,
     stereo:invertStereo,
     azuresw:azureSwitchReducer,
});

export default allReducers;
