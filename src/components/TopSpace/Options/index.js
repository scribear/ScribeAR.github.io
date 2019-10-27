import React from 'react';
import PropTypes from 'prop-types';
import OnOff from './OnOff';
import PlusMinus from './PlusMinus';
import './index.css';
import {
     flip_lockScreen,
     flip_invertColors,
     increment_textSize,
     decrement_textSize,
     increment_lineWidth,
     decrement_lineWidth,
     increment_numLines,
     decrement_numLines,
} from '../../../redux/actions'

export default function Options() {
     const textSize = (state) => state.textSize;
     const lineWidth = (state) => state.lineWidth;
     const numLines = (state) => state.numLines;
     const invertColors = (state) => state.invertColors;
     const lockScreen = (state) => state.lockScreen;

     return (
          <div className="Options" id="options-space">
               <h1>Options</h1>
               <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                         increment={increment_textSize}
                         decrement={decrement_textSize} />
               </div>
               <div className="item-wrapper">
                    <PlusMinus item="Line width" setting={lineWidth}
                         increment={increment_lineWidth}
                         decrement={decrement_lineWidth} />
               </div>
               <div className="item-wrapper">
                    <PlusMinus item="Number of lines" setting={numLines}
                         increment={increment_numLines}
                         decrement={decrement_numLines} />
               </div>
               <div className="item-wrapper">
                    <OnOff item="Lock screen" setting={lockScreen}
                         action={flip_lockScreen} />
               </div>
               <div className="item-wrapper">
                    <OnOff item="Invert colors" setting={invertColors}
                         action={flip_invertColors} />
               </div>
          </div>
     );
}
