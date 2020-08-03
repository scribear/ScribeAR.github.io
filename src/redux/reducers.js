import {combineReducers} from 'redux';

var savedTextSize = localStorage.getItem('text');
var savedColor = localStorage.getItem('color');
var savedBox = localStorage.getItem('box');
var savedMeh = localStorage.getItem('meh');
var savedbsz = localStorage.getItem('botsize')


var choiceColor = 0//0 = black; 1 = white
var choiceMeh = 0
var choiceBox = 40
var choiceTextSize = 6;
var choicebotsize = 1;

if (savedTextSize != null) {
    choiceTextSize = savedTextSize
}
if (savedMeh != null) {
    choiceMeh = savedMeh
}
if (savedBox != null) {
    choiceBox = savedBox
}
if (savedColor != null) {
    choiceColor = savedColor
}
if (savedbsz != null){
    choicebotsize = savedbsz
}
console.log(choicebotsize)
const submenuReducer = (state = 1, action) => {
    switch (action.type) {
        case 'SUBMENU_1':
            return 1;
        case 'SUBMENU_2':
            return 2;
        case 'SUBMENU_3' :
            return 3;
        case 'NEXT_PAGE':
            if (state + 1 > 3) {
                return 1
            } else {
                return state + 1;
            }
        case 'PREV_PAGE':
            if (state - 1 < 1) {
                return 3
            } else {
                return state - 1;
            }
        default:
            return state;
    }
}

const azureSwitchReducer = (state = 1, action) => {
    switch (action.type) {
        case 'NEXT_AZURE':
            return Math.min(2, state + 1);
        case 'PREV_AZURE':
            return Math.max(1, state - 1);
        default:
            return state;
    }
}

const onWebspeechReducer = (state = true, action) => {
    if (action.type == 'FLIP_ON_WEBSPEECH')
        return !state
    else return state
}

const textSizeReducer = (state = choiceTextSize, action) => {
    switch (action.type) {
        case 'INCREMENT_TEXTSIZE':
            state = state % 12 + 1;
            localStorage.setItem('text', state)
            return state;

        case 'DECREMENT_TEXTSIZE':
            state = Math.max(1, state - 1)
            localStorage.setItem('text', state)
            return state;
        default:
            localStorage.setItem('text', state)
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
            return Math.min(state + 1, 50);
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
    if (action.type === 'FLIP_INVERTCOLORS') {
        state = (state + 1) % 2
        localStorage.setItem('color', state)
        return state;
    }
    if (action.type === 'PICK_BLACK') {
        state = 0;
        localStorage.setItem('color', 0)
        return state;
    }
    if (action.type === 'PICK_WHITE') {
        localStorage.setItem('color', 1)
        return 1;
    } else return state;
}

const recordingReducer = (state = true, action) => {
    if (action.type === 'FLIP_RECORDING')
        return !state
    else return state
}

const recordingAzureReducer = (state = true, action) => {
    if (action.type == 'FLIP_RECORDING_AZURE')
        return !state
    else return state
}

const switchToAzureReducer = (state = false, action) => {
    if (action.type == 'SWITCH_TO_AZURE_REDUCER')
        return !state
    else return state
}

const enteredKeyReducer = (state = false, action) => {
    if (action.type == 'FLIP_ENTERED_KEY')
        return !state
    else return state
}

const correctAzureKeyReducer = (state = false, action) => {
    if (action.type == 'FLIP_CORRECT_AZUREKEY')
        return !state
    else return state
}

const checkAzureKeyReducer = (state = false, action) => {
    if (action.type == 'FLIP_CHECK_AZUREKEY')
        return !state
    else return state
}


const enteredRegionReducer = (state = false, action) => {
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
    if (action.type == 'FLIP_MENUHIDE') {
        state = (state + 1) % 2
        localStorage.setItem('meh', state)
        return state
    } else return state
}

const audioVisualiser = (state = 0, action) => {
    switch (action.type) {
        case 'AUDIOVIS_FLIP':
            if (state != 0) {
                state = 0;
            } else if (localStorage.getItem('mic') != null && state == 0) {
                state = localStorage.getItem('mic');
            } else if (localStorage.getItem('mic') == null) {
                state = 1;
            }
            return state;
        case 'AUDIOVIS_OFF':
            state = 0;
            return state;
        case 'MONO_LINE':
            state = 1;
            return state;
        case 'MONO_SPECTRUM':
            state = 2
            return state;
        case 'MONO_CIRCULAR':
            state = 3;
            return state;
        case 'STEREO_CIRCULAR':
            state = 4;
            return state;
        case 'STEREO_RECTANGULAR':
            state = 5;
            return state;
        case 'STEREO_SPECTRUM':
            state = 6;
            return state;
        default:
            return state;
    }
}
const buttomSizeReducer = (state = choicebotsize, action) => {
    switch (action.type) {
        case 'BOT_1':
            state = 0;
            localStorage.setItem('botsize',state)
            return state;
        case 'BOT_2':
            state = 1;
            localStorage.setItem('botsize',state)
            return state;
        case 'BOT_3':
            state = 2;
            localStorage.setItem('botsize',state)
            return state;
        default:
            return state;
    }
}
const visulizationSensitivityController = (state = 1.0, action) => {
    switch (action.type) {
        case 'INCREASE_SENSITIVITY':
            state += 0.1;
            return state;
        case 'DECREASE_SENSITIVITY':
            state -= 0.1;
            return state;
        default:
            return state;
    }

}


const allReducers = combineReducers({
    onWebspeech: onWebspeechReducer,
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
    mic: audioVisualiser,
    switchMenus: switchMenusReducer,
    recordingAzure: recordingAzureReducer,
    ins: instructionsReducer,
    meh: menuhideReducer,
    submenu: submenuReducer,
    azuresw: azureSwitchReducer,
    botsize: buttomSizeReducer,
    sens: visulizationSensitivityController,
});

export default allReducers;
