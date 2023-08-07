import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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


   function initialVal(value) {
      if (isNaN(value) || typeof value === 'undefined') {return 4;}
      return value;
   }

   function initialPos(value) {
      if (isNaN(value) || typeof value === 'undefined') {return 8;}
      return value;
   }

   let text_size = initialVal(displayStatus.textSize);
   let line_num = initialVal(displayStatus.rowNum);
   let transformed_line_num = (line_num * text_size * 1.18);
   let line_pos = initialPos(displayStatus.linePos);

   console.log("text size:", text_size);
   console.log("line position:", line_pos);
   console.log("font color:", displayStatus.textColor);

   let position_change = 0;
   while (line_pos * 6.25 + transformed_line_num > 93) {
      position_change = 1;
      line_pos--;
   }
   console.log("lower bound:", (line_pos * 6.25 + transformed_line_num));

   const dispatch = useDispatch();
   const handleLinePositionBound = (event) => {
      dispatch({ type: 'SET_POS', payload: event })
   }
   if (position_change) {handleLinePositionBound(line_pos);}

   /**
    * 6.25 comes from 100 / 16. 
    * The position height has been divided into 16 parts. Top represents position height.
    * The fontsize comes from ./navbars/sidebar/captions
    * default is top at 50%, lineHeight at 4 lines.
    */
   return (
      <div>
         <AudioVis></AudioVis>
         <ul >
            <h3 id = "captionsSpace" 
               style = {{
                  position: 'fixed', width: '90%', 
                  textAlign: 'left', fontSize: text_size + "vh", 
                  paddingLeft: '5%', paddingRight: '50%', paddingTop: '0%',
                  left: '0', top: (line_pos * 6.25) + '%', 
                  overflowY: 'scroll', height: transformed_line_num + "vh", lineHeight: (text_size * 1.18) + "vh",
                  color: displayStatus.textColor
               }}>{transcript}
            </h3>
         </ul>
      </div>
   );
}