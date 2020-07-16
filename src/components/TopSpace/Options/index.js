import React from 'react'
import OnOff from './OnOff'
import Record from './Record'
import store from '../../../store'
import Micvisual from './Micvisual'
import Save from './Save'
import {useSelector,useDispatch} from "react-redux"
import Instru from "./Instru"
import Divider from '@material-ui/core/Divider';
import AzureTopSpace from '../../AzureTopSpace'
import './index.css'
import SwipeableTemporaryDrawer from "../../Drawer"
import MenuHider from '../../PlaceHolder/MenuHider'
import PlusMinus from './PlusMinus'
import {Button,IconButton} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SpringModal from './SpringModal'
import PopMenu from '../../PopMenu'
import Stereovisual  from'./Stereo'
import VisualControl from './VisualControl'
import MenuSwitch from '../../PopMenu/MenuSwitch'
import AzureOption from '../../AzureTopSpace/AzureOptions'
import AzureSwitch from './AzureSwitch'
import ColorSpring from './ColorSpring'

import {
     flip_switchMenus,
     flip_invertColors,
     increment_textSize,
     decrement_textSize,
     prev_page,
     next_page,
     submenu3,
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
     const dispatch = useDispatch()
     var choice = if_ins ? 'appear' : 'disappear';

     if (store.isSuccessReducer == 'success') {
       return (
          <div className="Options" id="options-space">
          <h2 style = {{fontFamily:"Arial"}}>OPTIONS</h2>
          <AzureSwitch />
          {/* <Divider/>
          <div className="item-wrapper">
                    <Record />
               </div>
               <div className="item-wrapper">
                      <Save />
               </div> */}
              <h3>Display</h3>
              <Divider/>
               <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                         increment={increment_textSize}
                         decrement={decrement_textSize} />
               </div>
               <div className = 'item-wrapper'>
                    <ColorSpring />
               </div>
              <h3>Audio Visulization</h3>
              <Divider/>
              <div>
               Go to Audio Setting
                    <IconButton onClick = {()=>dispatch(submenu3())}>
                          <ArrowForwardIosIcon />
                     </IconButton>
               </div>
               <h3>Instruction</h3>
               <Divider />
               <div className = 'item-wrapper instruction'>
                    <SpringModal />
               </div>

               {/*<div className="item-wrapper">*/}
               {/*     <AzureTopSpace button="Switch To Azure" setting={switchMenus}*/}
               {/*          action={flip_switchMenus} />*/}
               {/*</div>*/}
          </div>
       );
     } else {
     return (
          <div className="Options" id="options-space">
          <h2 style = {{fontFamily:"Arial"}}>OPTIONS</h2>
          <AzureSwitch />
          {/* <Divider/>
          <div className="item-wrapper">
                    <Record />
               </div>
               <div className="item-wrapper">
                      <Save />
               </div> */}
              <h3>Display</h3>
              <Divider/>
               <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                         increment={increment_textSize}
                         decrement={decrement_textSize} />
               </div>
               <div className = 'item-wrapper'>
                    <ColorSpring />
               </div>
              <h3>Audio Visulization</h3>
              <Divider/>

               <div style={{
                    marginLeft:'1vw',
                    marginBottom:'1vh',
               }}> 
               Go to Audio Setting
                    <IconButton onClick = {()=>dispatch(submenu3())}>
                          <ArrowForwardIosIcon />
                     </IconButton>
               </div>
             
               <h3>Instruction</h3>
               <Divider />
               <div className = 'item-wrapper instruction'>
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
