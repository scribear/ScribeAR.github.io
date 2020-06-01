import React from 'react'
import OnOff from './OnOff'
import PlusMinus from './PlusMinus'
import Record from './Record'
import Micvisual from './Micvisual'
import Divider from '@material-ui/core/Divider';
import './index.css'
import {
     flip_invertColors,
     flip_micVisual,
     increment_textSize,
     decrement_textSize,
} from '../../../redux/actions'

export default function Options() {
     // These are functions that take an object and return an element of the object.
     // They are passed to useSelector, which feeds the global state object into them.
     const textSize = (state) => state.textSize

     const invertColors = (state) => state.invertColors
     

     return (
          <div className="Options" id="options-space">
               <h1 style = {{fontFamily:"Arial"}}>OPTIONS</h1>
               <Divider/>
               <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                         increment={increment_textSize}
                         decrement={decrement_textSize} />
               </div>

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
