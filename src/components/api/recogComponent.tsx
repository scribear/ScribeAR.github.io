import {
   API,
   ApiStatus,
   AzureStatus,
   ControlStatus,
   ScribearServerStatus,
   /* DisplayStatus, */
   SRecognition,
   STATUS,
   /* WhisperStatus */
} from '../../react-redux&middleware/redux/typesImports';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { STTRenderer } from '../sttRenderer';
import { PlaybackStatus, StreamTextStatus } from '../../react-redux&middleware/redux/types/apiTypes';
import Swal from 'sweetalert2';
import { useRecognition } from './returnAPI';
import { selectSelectedModel } from '../../react-redux&middleware/redux/reducers/modelSelectionReducers';

export const RecogComponent: React.FC = (props) => {

   useEffect(() => {
      if (apiStatus.currentApi === API.AZURE_TRANSLATION) {
         Swal.fire({
            title: `It appears you were using Azure recognizer last time, would you like to switch to that?`,
            icon: 'info',
            allowOutsideClick: false,
            showDenyButton: true,
            confirmButtonText: 'Yes!',
            }).then((result) => {
              
               if (result.isConfirmed) {
                  Swal.fire('Switching to Azure', '', 'success')
                  let copyStatus = Object.assign({}, apiStatus);
                   // Urgh.
                  copyStatus.currentApi = API.AZURE_TRANSLATION;
                  copyStatus.webspeechStatus = STATUS.AVAILABLE;
                  copyStatus.whisperStatus = STATUS.AVAILABLE;
                  copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                  copyStatus.streamTextStatus = STATUS.AVAILABLE;
                  copyStatus.playbackStatus = STATUS.AVAILABLE;
                  copyStatus.azureTranslStatus = STATUS.TRANSCRIBING;

                  dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
               } else {
                  let copyStatus = Object.assign({}, apiStatus);
                  copyStatus.currentApi = API.WEBSPEECH;
                  copyStatus.webspeechStatus = STATUS.TRANSCRIBING;
                  copyStatus.whisperStatus = STATUS.AVAILABLE;
                  copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                  copyStatus.azureTranslStatus = STATUS.AVAILABLE;
                  copyStatus.streamTextStatus = STATUS.AVAILABLE;
                  copyStatus.playbackStatus = STATUS.AVAILABLE;
                  dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
               }
            })
      }
   },[])

   const dispatch = useDispatch()
   const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus
   })
   const streamTextStatus = useSelector((state: RootState) => {
      return state.StreamTextReducer as StreamTextStatus
   })
   const playbackStatus = useSelector((state: RootState) => {
      return state.PlaybackReducer as PlaybackStatus
   })

   const scribearServerStatus = useSelector((state: RootState) => {
      return state.ScribearServerReducer as ScribearServerStatus
   })

   const apiStatus = useSelector((state: RootState) => {
      return state.APIStatusReducer as ApiStatus
   })
   const controlStatus = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
   });
   const sRecog = useSelector((state: RootState) => {
      return state.SRecognitionReducer as SRecognition;
   })
   const selectedModelOption = useSelector(selectSelectedModel);

   // if else for whisper transcript, apiStatus for 4=whisper and control status for listening
   const transcript = useRecognition(sRecog, apiStatus, controlStatus, azureStatus, streamTextStatus, scribearServerStatus, selectedModelOption, playbackStatus);
   // console.log("Recog component received new transcript: ", transcript)
   return STTRenderer(transcript);
};
