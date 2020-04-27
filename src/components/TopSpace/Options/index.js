import React from 'react'
import OnOff from './OnOff'
import PlusMinus from './PlusMinus'
import Record from './Record'
import Slider from './Slider'
import Micvisual from './Micvisual'
import './index.css'
import {
     flip_invertColors,
     flip_micVisual,
     increment_textSize,
     decrement_textSize,
     increment_lineWidth,
     decrement_lineWidth,
     increment_numLines,
     decrement_numLines
} from '../../../redux/actions'

export default function Options() {
     // These are functions that take an object and return an element of the object.
     // They are passed to useSelector, which feeds the global state object into them.
     const textSize = (state) => state.textSize
     const lineWidth = (state) => state.lineWidth
     const numLines = (state) => state.numLines
     const invertColors = (state) => state.invertColors
     

     return (
          <div className="Options" id="options-space">
               <h1>Options</h1>
               <div className="item-wrapper">
                    <Slider item="Text size" setting={textSize}
                         increment={increment_textSize}
                         decrement={decrement_textSize} />
               </div>
               <div className="item-wrapper">
                    <Slider item="Line width" setting={lineWidth}
                         increment={increment_lineWidth}
                         decrement={decrement_lineWidth} />
               </div>
               {/*<div className="item-wrapper">*/}
               {/*     <PlusMinus item="Number of lines" setting={numLines}*/}
               {/*          increment={increment_numLines}*/}
               {/*          decrement={decrement_numLines} />*/}
               {/*</div>*/}
               <div className="item-wrapper">
                    <OnOff item="Invert colors" setting={invertColors}
                         action={flip_invertColors} />
               </div>
               <div className="item-wrapper">
                    <Micvisual />
               </div>
               <div className="item-wrapper">
                    <Record />
               </div>
          </div>
     );
}
