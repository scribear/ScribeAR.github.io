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

export const flip_recording = () => {
     return { type: 'FLIP_RECORDING' };
}

export const flip_micVisual = () => {
     return { type: 'FLIP_MICVISUAL' };
}
