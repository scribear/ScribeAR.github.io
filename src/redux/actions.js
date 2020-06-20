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

export const flip_switchMenus = () => {
     return { type: 'FLIP_SWITCHMENUS' };
}
export const flip_recording = () => {
     return { type: 'FLIP_RECORDING' };
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
export const flip_micVisual = () => {
     return { type: 'FLIP_MICVISUAL' };
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