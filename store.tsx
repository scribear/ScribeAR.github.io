import {DisplayReducer} from './redux/reducers/displayReducers'
import {APIStatusReducer, AzureReducer, StreamTextReducer, PhraseListReducer} from './redux/reducers/apiReducers'
import {ControlReducer} from './redux/reducers/controlReducers'
import { combineReducers, createStore } from 'redux'

const rootReducer = combineReducers({
  DisplayReducer,
  APIStatusReducer,
  AzureReducer,
  StreamTextReducer,
  ControlReducer,
  PhraseListReducer,
})

export const store = createStore(rootReducer)

export type RootState = ReturnType<typeof rootReducer>
