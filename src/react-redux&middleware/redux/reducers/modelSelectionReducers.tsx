import type { ModelOptions, ModelSelection, SelectedOption } from '../types/modelSelection'
import type { RootState } from '../typesImports'

const initialState: ModelSelection = { options: [], selected: null }


const saveLocally = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}
const getLocalState = (key: string) => {
  const localState = localStorage.getItem(key);

  if (localState) {
    return Object.assign(initialState, JSON.parse(localState));
  }

  return initialState;
}

export const ModelSelectionReducer = (
  state = getLocalState('modelSelection'),
  action
) => {
  let newState;
  switch (action.type) {
    case 'SET_MODEL_OPTIONS':
      newState = {
        ...state,
        options: action.payload as ModelOptions
      }
      saveLocally('modelSelection', newState)
      return newState;
    case 'SET_SELECTED_MODEL':
      newState = {
        ...state,
        selected: action.payload as SelectedOption
      }
      saveLocally('modelSelection', newState)
      return newState;
    default:
      return state
  }
}

export const selectModelOptions = (state: RootState) => state.ModelSelectionReducer.options;
export const setModelOptions = (options: ModelOptions) => {
  return { type: 'SET_MODEL_OPTIONS', payload: options }
}
export const selectSelectedModel = (state: RootState) => state.ModelSelectionReducer.selected;
export function setSelectedModel(selected: SelectedOption) {
  return { type: 'SET_SELECTED_MODEL', payload: selected }
}