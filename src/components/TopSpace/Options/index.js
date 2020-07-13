import React from 'react'
import OnOff from './OnOff'
import Record from './Record'
import store from '../../../store'
import Micvisual from './Micvisual'
import Save from './Save'
import {useSelector} from "react-redux"
import Instru from "./Instru"
import Divider from '@material-ui/core/Divider';
import AzureTopSpace from '../../AzureTopSpace'
import './index.css'
import SwipeableTemporaryDrawer from "../../Drawer"
import MenuHider from '../../PlaceHolder/MenuHider'
import PlusMinus from './PlusMinus'
import {Button} from '@material-ui/core';
import SpringModal from './SpringModal'
import PopMenu from '../../PopMenu'
import Stereovisual  from'./Stereo'
import VisualControl from './VisualControl'

import {
     flip_switchMenus,
     flip_invertColors,
     increment_textSize,
     decrement_textSize,
} from '../../../redux/actions'

export default function Options() {
     // These are functions that take an object and return an element of the object.
     // They are passed to useSelector, which feeds the global state object into them.
     const textSize = (state) => state.textSize
     const lineWidth = (state) => state.lineWidth
     const numLines = (state) => state.numLines
     const invertColors = (state) => state.invertColors
     const switchMenus = (state) => state.switchMenus
     const ins = (state) => state.ins
     const if_ins = useSelector((state) => state.ins)
     var choice = if_ins ? 'appear' : 'disappear';

     if (store.isSuccessReducer == 'success') {
       return (
            <div className="Options" id="options-space">
                <h2 style = {{fontFamily:"Arial"}}>OPTIONS</h2>
                <h3>Caption</h3>
                <Divider/>
                <div className="item-wrapper">
                      <Record />
                 </div>
                <div className="item-wrapper">
                    <Save />
                 </div>
                 <div className="item-wrapper">
                      <PlusMinus item="Text size" setting={textSize}
                           increment={increment_textSize}
                           decrement={decrement_textSize} />
                 </div>

                 <div className="item-wrapper">
                      <OnOff item="Invert colors" setting={invertColors}
                           action={flip_invertColors} />
                 </div>
                <Divider/>
                <div className="item-wrapper">
                  <VisualControl />
              </div>
                 <div className="item-wrapper">
                      <Micvisual />
                 </div>
                <div className="item-wrapper">
                  <Stereovisual/>
              </div>

                     <div className = 'item-wrapper'>
                          <SpringModal />
                    </div>
                 <Divider />
            </div>
       );
     } else {
     return (
          <div className="Options" id="options-space">
          <h2 style = {{fontFamily:"Arial"}}>OPTIONS</h2>
              <h3>Caption</h3>
          <Divider/>
          <div className="item-wrapper">
                    <Record />
               </div>
               <div className="item-wrapper">
                      <Save />
               </div>
              <h3>Display</h3>
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
              <h3>Audio Visulization</h3>
              <Divider/>
               <div className="item-wrapper">
                  <VisualControl />
              </div>
               <div className="item-wrapper">
                    <Micvisual />
               </div>
              <div className="item-wrapper">
                  <Stereovisual/>
              </div>

               <div className = 'item-wrapper'>
                    <SpringModal />
               </div>
               {/*<div className="item-wrapper">*/}
               {/*     <AzureTopSpace button="Switch To Azure" setting={switchMenus}*/}
               {/*          action={flip_switchMenus} />*/}
               {/*</div>*/}
          </div>
     );
   }
}
