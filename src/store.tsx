import {DisplayReducer} from './redux/reducers/displayReducers'
import {APIStatusReducer, AzureReducer, StreamtextReducer, PhraseListReducer} from './redux/reducers/apiReducers'
import {ControlReducer} from './redux/reducers/controlReducers'

import { combineReducers, createStore } from 'redux'

const rootReducer = combineReducers({
  DisplayReducer,
  APIStatusReducer,
  AzureReducer,
  StreamtextReducer,
  ControlReducer,
  PhraseListReducer,
})

export const store = createStore(rootReducer)

export type RootState = ReturnType<typeof rootReducer>
