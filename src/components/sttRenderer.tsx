import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'; // TODO: use Swal like before if appropriate

import { RootState } from '../store';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition 
} from '../react-redux&middleware/redux/typesImports'
import { useRecognition } from './api/returnAPI';
import { AudioVis } from './api/visualization/audioVis';


export const STTRenderer = () : JSX.Element => {
   // TODO: use createSelector to memoize the selector
   const controlStatus = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
   });
   const displayStatus = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
   });
   const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus;
   })
   const apiStatus = useSelector((state: RootState) => {
      return state.APIStatusReducer as ApiStatus;
   })
   const sRecog = useSelector((state: RootState) => {
      return state.SRecognitionReducer as SRecognition;
   })

   // if else for whisper transcript, apiStatus for 4=whisper and control status for listening
   
   const { transcript, recogHandler } = useRecognition(sRecog, apiStatus, controlStatus, azureStatus);
   // console.log('40', transcript);


   return (
      <div>
         <AudioVis></AudioVis>
         <ul >
            <h3 id = "captionsSpace" 
               style = {{
                  position: 'fixed', width: '90%', 
                  textAlign: 'left', left: '0', fontSize: displayStatus.textSize + "vh", 
                  paddingLeft: '5%', paddingRight: '60%', 
                  overflowY: 'scroll', height: '40%', 
                  color: displayStatus.textColor
               }}>{transcript}
            </h3>
         </ul>
      </div>
   );
}