// src/react-redux&middleware/redux/reducers/modelSelectionReducers.tsx

import { AnyAction } from 'redux';
import type { SelectedOption } from '../types/modelSelection';
import type { RootState } from '../../../store';

export interface ModelSelectionState {
  options: SelectedOption[];
  selected: SelectedOption | null;
}

/** tiny-multi → tiny-q5_1 (canonical key for multilingual tiny) */
const normalizeModelKey = (raw: string): string => {
  if (raw === 'tiny-multi' || raw === 'tiny-multi-q5_1') return 'tiny-q5_1';
  return raw;
};

/** Defaults before server sends a model list */
const defaultOptions: SelectedOption[] = [
  {
    model_key: 'tiny-en-q5_1',
    display_name: 'tiny-en',
    description: 'Whisper tiny English (quantized q5_1)',
    available_features: 'en',
  },
  {
    model_key: 'tiny-q5_1', // multilingual tiny, shown as "tiny-multi"
    display_name: 'tiny-multi',
    description: 'Whisper tiny multilingual (quantized q5_1)',
    available_features: 'multi',
  },
];

/**
 * Take an arbitrary object and coerce it into a SelectedOption,
 * filling in defaults for any missing fields.
 */
const toSelectedOption = (raw: any): SelectedOption => {
  if (typeof raw === 'string') {
    const model_key = normalizeModelKey(raw);
    const fromDefaults = defaultOptions.find(
      (opt) => !!opt && opt.model_key === model_key,
    );
    return (
      fromDefaults ?? {
        model_key,
        display_name: model_key,
        description: '',
        available_features: '',
      }
    );
  }

  const model_key = normalizeModelKey(
    raw?.model_key ??
      raw?.key ??
      raw?.id ??
      raw?.value ??
      'tiny-en-q5_1',
  );

  const display_name =
    raw?.display_name ??
    raw?.label ??
    raw?.name ??
    model_key;

  const description: string = raw?.description ?? '';
  const available_features: string = raw?.available_features ?? '';

  return {
    model_key,
    display_name,
    description,
    available_features,
  };
};

export const initialModelSelectionState: ModelSelectionState = {
  options: defaultOptions,
  selected: defaultOptions[0],
};

const ModelSelectionReducer = (
  state: ModelSelectionState = initialModelSelectionState,
  action: AnyAction,
): ModelSelectionState => {
  switch (action.type) {
    // Replace the list of options (e.g. when server sends models)
    case 'MODEL_SELECTION/SET_OPTIONS':
    case 'SET_MODEL_OPTIONS': {
      const payload = action.payload;
      let rawOptions: any[];

      if (Array.isArray(payload)) {
        rawOptions = payload;
      } else if (Array.isArray(payload?.options)) {
        rawOptions = payload.options;
      } else {
        return state;
      }

      const options: SelectedOption[] = rawOptions.map(toSelectedOption);

      // Keep current selection if still present, else fall back to first
      let selected = state.selected;

      if (!selected) {
        selected = options[0] ?? null;
      } else {
        const exists = options.some(
          (o: SelectedOption | null) =>
            o?.model_key === selected!.model_key,
        );
        if (!exists) {
          selected = options[0] ?? null;
        }
      }

      return {
        ...state,
        options,
        selected,
      };
    }

    // Change which model is selected
    case 'MODEL_SELECTION/SELECT':
    case 'SELECT_MODEL':
    case 'SET_SELECTED_MODEL': {
      if (!action.payload) return state;
      const opt = toSelectedOption(action.payload);
      return {
        ...state,
        selected: opt,
      };
    }

    default:
      return state;
  }
};

export default ModelSelectionReducer;
// for `import { ModelSelectionReducer } from ...`
export { ModelSelectionReducer };

/** Action creators used by scribearRecognizer + UI menus */
export const setModelOptions = (options: SelectedOption[]) => ({
  type: 'SET_MODEL_OPTIONS',
  payload: options,
});

export const setSelectedModel = (option: SelectedOption | null) => ({
  type: 'SET_SELECTED_MODEL',
  payload: option,
});

/** Selectors used across the app */
export const selectModelOptions = (state: RootState): SelectedOption[] =>
  state.ModelSelectionReducer.options;

export const selectSelectedModel = (state: RootState): SelectedOption | null =>
  state.ModelSelectionReducer.selected;
