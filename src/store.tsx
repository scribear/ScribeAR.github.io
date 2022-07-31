import { DisplayReducer } from './redux/reducers/displayReducers'
import { APIStatusReducer, AzureReducer, StreamTextReducer, PhraseListReducer } from './redux/reducers/apiReducers'
import { ControlReducer } from './redux/reducers/controlReducers'
import { BucketStreamReducer } from './redux/reducers/bucketStreamReducers'

import { combineReducers, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

const rootReducer = combineReducers({
  DisplayReducer,
  APIStatusReducer,
  AzureReducer,
  StreamTextReducer,
  ControlReducer,
  PhraseListReducer,
  BucketStreamReducer,
})

// export const store = createStore(rootReducer)
export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof rootReducer>
