
const nullFunction = () => {};
enum COLOR {
  "BLACK",
  "WHITE",
}
const initialState = {
  textSize: 6,
  color: COLOR.BLACK
}

// todo save appearance in local storage
export default function AppearanceReducer(state = initialState, action) {
  switch (action.type) {
    case 'PICK_BLACK':
      state.color = 0;
      return state.color;
    case 'PICK_WHITE':
      state.color = 1;
      return state.color;
    case 'INCREMENT_TEXTSIZE':
      return state.textSize % 12 + 1;
    case 'DECREMENT_TEXTSIZE':
      return Math.max(1, state.textSize - 1);
    default:
      return state;
  }
}