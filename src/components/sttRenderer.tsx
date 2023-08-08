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

   let position_change = 0;
   while (line_pos * 6.25 + transformed_line_num > 93) {
      position_change = 1;
      line_pos--;
   }
   let transcript_info = {
      "text size": text_size, 
      "line position": line_pos, 
      "font color": displayStatus.textColor,
      "lower bound": (line_pos * 6.25 + transformed_line_num)
   }
   console.log("caption info:", transcript_info)

   const dispatch = useDispatch();
   const handleLinePositionBound = (event) => {
      dispatch({ type: 'SET_POS', payload: event })
   }
   if (position_change) {handleLinePositionBound(line_pos);}
   position_change = 0;



   const containerRef = useRef<HTMLDivElement | null>(null);
   const handleClick = () => {
      const container = containerRef.current;
      if (container) {
         if (container.scrollTop + container.clientHeight < container.scrollHeight - 5) {
            container.scrollTop = container.scrollHeight - container.clientHeight;
         }
      }
   }


   // const [visible, setVisible] = useState(false);
   // const [top, setTop] = useState(0);
   // const container = containerRef.current;
   // if (container && top !== 0) {
   //    container.scrollTop = top;
   //    console.log('container.scrollTop', container.scrollTop);
   // }
   
   const handleScroll = () => {
      const container = containerRef.current;
      console.log('container!', container);
      if (container) {
         console.log('container sctop!', container.scrollTop);
         console.log('container clhie!', container.clientHeight);
         console.log('container scrhei!', container.scrollHeight);
         if (container.scrollTop + container.clientHeight < container.scrollHeight - 5) {
            console.log('visible should be true');
            // if (!visible) {
            //    setTop(container.scrollTop);
            //    setVisible(true);
            // }
         } else {
            console.log('visible should be false');
            // if (visible) {
            //    setTop(container.scrollTop);
            //    setVisible(false);
            // }
         }
      }
   };
   // console.log('visible val', visible);





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
            <h3 className="captions" ref={containerRef} onScroll={handleScroll}
               id = "captionsSpace" 
               style = {{
                  position: 'fixed', width: '90%', 
                  textAlign: 'left', fontSize: text_size + "vh", 
                  paddingLeft: '5%', paddingRight: '50%', paddingTop: '0%',
                  left: '0', top: (line_pos * 6.25) + '%', 
                  overflowY: 'scroll', height: transformed_line_num + "vh", lineHeight: (text_size * 1.18) + "vh",
                  color: displayStatus.textColor
               }}>{transcript}
            </h3>
            {/* {!shouldHide &&  */}
            <button
            onClick={handleClick}
            style = {{
                  position: 'fixed', 
                  paddingTop: '0%', borderRadius: "34%", border: '5px solid ' + displayStatus.secondaryColor,
                  left: '5%', top: (line_pos * 6.25) - 0.8 * text_size + '%', 
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
            {/* } */}
         </ul>
      </div>
   );
}