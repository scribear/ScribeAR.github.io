
const nullFunction = () => {};

const initialState = {
  recording: true,
}

// todo potentially other reducers involving control
export default function ControlReducer(state = initialState, action) {
  switch (action.type) {
    case 'FLIP_RECORDING':
      return !state
    default:
      return state;
  }
}