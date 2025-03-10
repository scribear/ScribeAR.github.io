import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { DisplayStatus } from '../react-redux&middleware/redux/typesImports'
import { AudioVis } from './api/visualization/audioVis';
import { KeyboardDoubleArrowDownIcon } from '../muiImports';


export const STTRenderer = (transcript: string) : JSX.Element => {

   const displayStatus = useSelector((state: RootState) => {
      return state.DisplayReducer as DisplayStatus;
   });

   // let parts = transcript.split('<br>');
   // console.log("parts", parts)


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
   let line_height = (1 + 0.1 * displayStatus.lineHeight);
   let transformed_line_num = (line_height * line_num * text_size * 1.18);
   let button_line_num = (line_height * (line_num + 1) * text_size * 1.18);
   let line_pos = initialPos(displayStatus.linePos);

   // position_change represents if we changed the line position (top, middle, bottom, etc.)
   // The goal is to make sure that we don't go below the bottom of the screen.
   let position_change = 0;
   while ((line_pos * 6.25 + button_line_num > 93) && (line_pos > 0)) {
      position_change = 1;
      line_pos--;
   }

   // row_change represents if we changed the number of displayed rows.
   // The goal is to make sure that we don't show too many lines of caption if we are at the limit 
   // (when line position is already at the very top).
   let row_change = 0;
   while ((line_pos * 6.25 + button_line_num > 93) && (line_pos === 0)) {
      row_change = 1;
      line_num--;
      transformed_line_num = (line_height * line_num * text_size * 1.18);
      button_line_num = (line_height * (line_num + 1) * text_size * 1.18);
   }

   // // row_change represents if we changed the number of displayed rows.
   // // The goal is to make sure that we don't show too many lines of caption if we are at the limit 
   // // (when line position is already at the very top).
   // let line_height_change = 0;
   // while ((line_pos * 6.25 + transformed_line_num > 93) && (line_pos == 0)) {
   //    line_height_change = 1;
   //    line_num--;
   //    transformed_line_num = (line_num * text_size * 1.18);
   //    button_line_num = ((line_num + 1) * text_size * 1.18);
   // }
   
   if(false) {
      let transcript_info = {
         "text size": text_size, 
         "line position": line_pos, 
         "font color": displayStatus.textColor,
         "word spacing": displayStatus.wordSpacing,
         "lower bound": (line_pos * 6.25 + transformed_line_num),
         "line height": displayStatus.lineHeight
      };
      console.log("caption info:", transcript_info);
   }  
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

   const transcriptContainerRef = useRef<HTMLDivElement>(null);
   const [autoScroll, setAutoScroll] = useState(true); 

   useEffect(() => {
      if (transcriptContainerRef.current && autoScroll) {
         transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
      }
   }, [transcript, autoScroll]);

   const handleScroll = () => {
      if (!transcriptContainerRef.current) return;

      // Check if we are scrolled close (within 1 line of text) to the bottom
      const isScrolledToBottom = 
         transcriptContainerRef.current.scrollHeight - transcriptContainerRef.current.scrollTop < transcriptContainerRef.current.clientHeight + text_size;
      
      // Autoscroll if we are at the bottom, otherwise, disable auto scrolling
      setAutoScroll(isScrolledToBottom);
   }

   const handleClick = () => {
      setAutoScroll(true);
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
            <h3 className="captions" ref={transcriptContainerRef} onScroll={handleScroll}
               id = "captionsSpace" 
               style = {{
                  position: 'fixed', width: '90%', 
                  textAlign: 'left', fontSize: text_size + "vh", 
                  paddingLeft: '5%', paddingRight: '50%', paddingTop: '0%',
                  left: '0', top: (line_pos * 6.25) + '%', 
                  overflowY: 'scroll', 
                  height: transformed_line_num + "vh", 
                  lineHeight: (line_height * text_size * 1.18) + "vh",
                  color: displayStatus.textColor,
                  wordSpacing: 2 * displayStatus.wordSpacing + "px"
               }}>{ transcript }
            </h3>

            {/* {showButton &&
            <h3
            style = {{
                  position: 'fixed', 
                  paddingTop: '0%',
                  left: '5%', 
                  marginLeft: '70%',
                  // top: (line_pos * 6.25) - 0.8 * text_size + '%', 
                  top: `calc(${top}% + ${transformed_line_num}vh)`, 
                  height: (2 * 0.618 * text_size) + "vh",
                  width: (2 * text_size) + "vh",
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: displayStatus.textColor,
                  backgroundColor: displayStatus.primaryColor,
               }}> . . . 
            </h3>
            } */}

            {!autoScroll && 
            <button
            onClick={handleClick}
            style = {{
                  position: 'fixed', 
                  paddingTop: '0%', borderRadius: "34%", border: '5px solid ' + displayStatus.secondaryColor,
                  left: '5%', 
                  marginLeft: '80%',
                  // top: (line_pos * 6.25) - 0.8 * text_size + '%', 
                  top: `calc(${top}% + ${button_line_num}vh)`, 
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