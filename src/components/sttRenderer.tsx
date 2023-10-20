import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'; // TODO: use Swal like before if appropriate

import { RootState } from '../store';
import { 
   DisplayStatus, AzureStatus, ControlStatus, 
   ApiStatus, SRecognition 
} from '../react-redux&middleware/redux/typesImports'
import { useRecognition } from './api/returnAPI';
import { AudioVis } from './api/visualization/audioVis';
import { KeyboardDoubleArrowDownIcon } from '../muiImports';


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

   let parts = transcript.split('<br>');
   console.log("parts", parts)


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

   // position_change represents if we changed the line position (top, middle, bottom, etc.)
   // The goal is to make sure that we don't go below the bottom of the screen.
   let position_change = 0;
   while ((line_pos * 6.25 + transformed_line_num > 93) && (line_pos > 0)) {
      position_change = 1;
      line_pos--;
   }

   // row_change represents if we changed the number of displayed rows.
   // The goal is to make sure that we don't show too many lines of caption if we are at the limit 
   // (when line position is already at the very top).
   let row_change = 0;
   while ((line_pos * 6.25 + transformed_line_num > 93) && (line_pos == 0)) {
      row_change = 1;
      line_num--;
      transformed_line_num = (line_num * text_size * 1.18);
   }
   
   let transcript_info = {
      "text size": text_size, 
      "line position": line_pos, 
      "font color": displayStatus.textColor,
      "lower bound": (line_pos * 6.25 + transformed_line_num)
   }
   console.log("caption info:", transcript_info)
   let top = line_pos * 6.25

   const dispatch = useDispatch();
   const handleLinePositionBound = (event) => {
      dispatch({ type: 'SET_POS', payload: event })
   }
   const handleRowNumberBound = (event) => {
      dispatch({ type: 'SET_ROW_NUM', payload: event })
   }
   if (position_change) {handleLinePositionBound(line_pos);}
   position_change = 0;
   if (row_change) {handleRowNumberBound(line_num);}
   row_change = 0;

   const [showButton, setShowButton] = useState(false);
   
   const capts = document.getElementById('captionsSpace')
   
   // autoscroll to bottom
   if (capts && !showButton) {
      capts.scrollTop = capts.scrollHeight - capts.clientHeight
   }

   const handleClick = () => {
      // setAllowScroll(!allowScroll);
      setShowButton(false);
   }

   const handleScroll = () => {
      // we scroll up, the scrolldown button appears, and we disable auto scroll down.
      if ((!showButton) && capts && (capts.scrollTop + capts.clientHeight < capts.scrollHeight - 5)) {
         setShowButton(true);
      }
      // we manually scroll down, the scrolldown button should disappear, and should trigger automatic scroll down.
      else if ((showButton) && capts && (capts.scrollTop + capts.clientHeight >= capts.scrollHeight - 5)) {
         setShowButton(false);
      }
   }


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
            <h3 className="captions" onScroll={handleScroll}
               id = "captionsSpace" 
               style = {{
                  position: 'fixed', width: '90%', 
                  textAlign: 'left', fontSize: text_size + "vh", 
                  paddingLeft: '5%', paddingRight: '50%', paddingTop: '0%',
                  left: '0', top: (line_pos * 6.25) + '%', 
                  overflowY: 'scroll', height: transformed_line_num + "vh", lineHeight: (text_size * 1.18) + "vh",
                  color: displayStatus.textColor
               }}>{ transcript }
            </h3>

            {showButton && 
            <button
            onClick={handleClick}
            style = {{
                  position: 'fixed', 
                  paddingTop: '0%', borderRadius: "34%", border: '5px solid ' + displayStatus.secondaryColor,
                  left: '5%', 
                  // marginLeft: '70%',
                  top: (line_pos * 6.25) - 0.8 * text_size + '%', 
                  // top: `calc(${top}% + ${transformed_line_num}vh)`, 
                  height: (2 * 0.618 * text_size) + "vh",
                  width: (2 * text_size) + "vh",
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: displayStatus.textColor,
                  backgroundColor: displayStatus.primaryColor,
                  cursor: "pointer",
                  display: "flex",
               }}> <KeyboardDoubleArrowDownIcon/>
            </button>
            }

         </ul>
      </div>
   );
}