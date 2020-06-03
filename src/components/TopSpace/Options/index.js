import React from 'react'
import OnOff from './OnOff'
import PlusMinus from './PlusMinus'
import Record from './Record'
import Micvisual from './Micvisual'
import Instru from "./Instru"
import Divider from '@material-ui/core/Divider';
import './index.css'
import {useSelector} from "react-redux"
import {
     flip_invertColors,
     flip_micVisual,
     increment_textSize,
     decrement_textSize,
     flip_instructions,
} from '../../../redux/actions'
import MenuHider from '../../PlaceHolder/MenuHider'

export default function Options() {
     // These are functions that take an object and return an element of the object.
     // They are passed to useSelector, which feeds the global state object into them.
     const textSize = (state) => state.textSize
     const invertColors = (state) => state.invertColors
     const ins = (state) => state.ins
     const if_ins = useSelector((state) => state.ins)
     var choice = if_ins ? 'appear' : 'disappear';

     return (
          <div className="Options" id="options-space">
               <h2 style = {{fontFamily:"Arial"}}>OPTIONS</h2>
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
               <div className= "item-wrapper">
                    <Instru item="Instructions" setting = {ins}
                     action = {flip_instructions} />
               </div>
               <div className="item-wrapper">
                    <Micvisual />
               </div>
               <div className="item-wrapper">
                    <Record />
               </div>
               <Divider />
               <div className = {choice}>
                    <p style = {{margin:0}}>-The text size button can be used to change size of 
                    text shown in caption space.</p>
                    <p style = {{margin:0}}>-There are 3 different graph can be toggled to help
                    reflex the surrounding voices by clicking forth button</p>
                    <p style = {{margin:0}}>-For circular graph, try to drag it around.</p>
                    <p style = {{margin:0}}>-To stop captioning just click switch button for Recording. Also 
                    click again to resume captioning.</p>
               </div>

          </div>
     );
}
