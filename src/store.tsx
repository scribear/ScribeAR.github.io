import { DisplayReducer } from './react-redux&middleware/redux/reducers/displayReducers'
import { APIStatusReducer, AzureReducer, PhraseListReducer, WhisperReducer } from './react-redux&middleware/redux/reducers/apiReducers'
import { ControlReducer } from './react-redux&middleware/redux/reducers/controlReducers'
import { BucketStreamReducer } from './react-redux&middleware/redux/reducers/bucketStreamReducers'
import { TranscriptReducer } from './react-redux&middleware/redux/reducers/transcriptReducers'
import { SRecognitionReducer } from './react-redux&middleware/redux/reducers/sRecognitionReducers'

import { combineReducers, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

const rootReducer = combineReducers({
   DisplayReducer,
   APIStatusReducer,
   WhisperReducer,
   AzureReducer,
   ControlReducer,
   PhraseListReducer,
   BucketStreamReducer,
   TranscriptReducer,
   SRecognitionReducer,
})

// export const store = createStore(rootReducer)
export const store = configureStore({
   reducer: rootReducer,
   middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof rootReducer>
