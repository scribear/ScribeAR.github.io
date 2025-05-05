import {
   APIStatusReducer, AzureReducer, PhraseListReducer, StreamTextReducer,
   WhisperReducer, ScribearServerReducer, PlaybackReducer
} from './react-redux&middleware/redux/reducers/apiReducers'
import { combineReducers } from 'redux'

import { BucketStreamReducer } from './react-redux&middleware/redux/reducers/bucketStreamReducers'
import { ControlReducer } from './react-redux&middleware/redux/reducers/controlReducers'
import { DisplayReducer } from './react-redux&middleware/redux/reducers/displayReducers'
import { SRecognitionReducer } from './react-redux&middleware/redux/reducers/sRecognitionReducers'
import { TranscriptReducer } from './react-redux&middleware/redux/reducers/transcriptReducers'

import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import { ModelSelectionReducer } from './react-redux&middleware/redux/reducers/modelSelectionReducers'

const rootReducer = combineReducers({
   DisplayReducer,
   APIStatusReducer,
   WhisperReducer,
   AzureReducer,
   StreamTextReducer,
   ControlReducer,
   PhraseListReducer,
   BucketStreamReducer,
   TranscriptReducer,
   SRecognitionReducer,
   ScribearServerReducer,
   PlaybackReducer,
   ModelSelectionReducer
})

// export const store = createStore(rootReducer)
export const store = configureStore({
   reducer: rootReducer,
   middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof rootReducer>
