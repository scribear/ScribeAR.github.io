// Actions are the functions that we call throughout the project to change global state.

export const set_screenWidth = (width) => {
     return {
          type: 'SET_SCREENWIDTH',
          value: width
     };
}

export const set_screenHeight = (height) => {
     return {
          type: 'SET_SCREENHEIGHT',
          value: height
     };
}

export const increment_textSize = () => {
     return { type: 'INCREMENT_TEXTSIZE' };
}

export const decrement_textSize = () => {
     return { type: 'DECREMENT_TEXTSIZE' };
}

export const increment_lineWidth = () => {
     return { type: 'INCREMENT_LINEWIDTH' };
}

export const decrement_lineWidth = () => {
     return { type: 'DECREMENT_LINEWIDTH' };
}

export const increment_numLines = () => {
     return { type: 'INCREMENT_NUMLINES' };
}

export const decrement_numLines = () => {
     return { type: 'DECREMENT_NUMLINES' };
}

export const flip_lockScreen = () => {
     return { type: 'FLIP_LOCKSCREEN' };
}

export const flip_invertColors = () => {
     return { type: 'FLIP_INVERTCOLORS' };
}

export const pick_black = () => {
     return { type: 'PICK_BLACK'};
}

export const pick_white = () => {
     return { type: 'PICK_WHITE'}
}

export const flip_switchMenus = () => {
     return { type: 'FLIP_SWITCHMENUS' };
}
export const flip_recording = () => {
     return { type: 'FLIP_RECORDING' };
}
export const flip_on_webspeech = () =>{
     return { type: 'FLIP_ON_WEBSPEECH'};
}


export const flip_recording_azure = () => {
     return {type: 'FLIP_RECORDING_AZURE'}
}

export const azure_key = (key) => {
     return {
          type: 'KEY_AZURE',
          key: "dsfdsf"
     }
}
export const azure_region = (region) => {
     return {
          type: 'AZURE_REGION',
          region: "dsfdsf"
     }
}
export const next_azure = () =>{
     return {type:'NEXT_AZURE'}
}
export const prev_azure = () =>{
     return {type:'PREV_AZURE'}
}

export const flip_entered_key = () => {
     return { type: 'FLIP_ENTERED_KEY' };
}
export const flip_entered_region = () => {
     return { type: 'FLIP_ENTERED_REGION' };
}
export const flip_correct_azureKey = () => {
     return { type: 'FLIP_CORRECT_AZUREKEY' };
}
export const flip_switch_to_azure = () => {
     return { type: 'FLIP_SWITCH_TO_AZURE' };
}
export const flip_check_azureKey = () => {
     return { type: 'FLIP_CHECK_AZUREKEY' };
}
export const flip_instructions = () =>{
     return { type: 'FLIP_INSTRUCTIONS'};
}

export const flip_menuhide = () =>{
     return { type: 'FLIP_MENUHIDE'};
}

export const submenu1 = () =>{
     return { type: 'SUBMENU_1'}
}
export const submenu2 = () =>{
     return { type: 'SUBMENU_2'}
}
export const submenu3 = () =>{
     return { type: 'SUBMENU_3'}
}
export const next_page = () => {
     return { type: 'NEXT_PAGE'}
}
export const prev_page = () => {
     return {type: 'PREV_PAGE'}
}
export const audiovis_flip = () => {
     return {type: 'AUDIOVIS_FLIP'}
}
export const mono_line = () => {
     return {type: 'MONO_LINE'}
}
export const mono_spectrum = () => {
     return {type: 'MONO_SPECTRUM'}
}
export const mono_circular = () => {
     return {type: 'MONO_CIRCULAR'}
}
export const stereo_circular = () => {
     return {type: 'STEREO_CIRCULAR'}
}
export const stereo_rectangular = () => {
     return {type: 'STEREO_RECTANGULAR'}
}
export const stereo_spectrum = () => {
     return {type: 'STEREO_SPECTRUM'}
}
export const audiovis_off = () => {
     return {type: 'AUDIOVIS_OFF'}
}
export const bot_1 = () => {
     return { type: 'BOT_1' }
}
export const bot_2 = () =>{
     return { type: 'BOT_2'} 
}
export const bot_3 = () => {
     return { type: 'BOT_3'}
}
export const increase_sensitivity = () => {
     return {type: 'INCREASE_SENSITIVITY'}
}
export const decrease_sensitivity = () => {
     return {type: 'DECREASE_SENSITIVITY'}
}