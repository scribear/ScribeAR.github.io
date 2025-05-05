import type { ModelOptions, ModelSelection, SelectedOption } from '../types/modelSelection'
import type { RootState } from '../typesImports'

const initialState: ModelSelection = { options: [], selected: null }

export const ModelSelectionReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case 'SET_MODEL_OPTIONS':
      return {
        ...state,
        options: action.payload as ModelOptions
      }
    case 'SET_SELECTED_MODEL':
      return {
        ...state,
        selected: action.payload as SelectedOption
      }
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