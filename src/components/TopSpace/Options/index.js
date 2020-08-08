import React from 'react'
import Record from './Record'
import store from '../../../store'
import Save from './Save'
import {useSelector, useDispatch} from "react-redux"
import Divider from '@material-ui/core/Divider';
import './index.css'
import PlusMinus from './PlusMinus'
import {Button, IconButton} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SpringModal from './SpringModal'
import ColorSpring from './ColorSpring'
import BoxSpring from './BoxSpring'
import SwitchAPI from '../../SwitchAPI'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';//----------------------------------------------------------
// import OnOff from './OnOff'
// import PopMenu from '../../PopMenu'
// import MenuSwitch from '../../PopMenu/MenuSwitch'
// import AzureOption from '../../AzureTopSpace/AzureOptions'
// import AzureSwitch from './AzureSwitch'
// import SwipeableTemporaryDrawer from "../../Drawer"
// import MenuHider from '../../PlaceHolder/MenuHider'
// import AzureTopSpace from '../../AzureTopSpace'
// import Instru from "./Instru"



import {
    flip_switchMenus,
    flip_invertColors,
    increment_textSize,
    decrement_textSize,
    prev_page,
    next_page,
    submenu3,
    submenu2,
    audiovis_flip,
} from '../../../redux/actions'

import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

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

    const stereoSwitch = (state) => state.mic
    const audioVis = useSelector(stereoSwitch)

    if (store.isSuccessReducer == 'success') {
        return (
            <div className="Options" id="options-space">
                <h2 style={{fontFamily: "Arial"}}>OPTIONS</h2>
                <h3>
                    Source
                    <IconButton size = 'small' onClick={() => dispatch(submenu2())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>
                <Divider/>
                <div className='item-wrapper'>
                    <SwitchAPI/>
                </div>
                <div className='item-wrapper'>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className='item-wrapper'>
                    <ColorSpring/>
                </div>
                <div className='item-wrapper'>
                    <BoxSpring/>
                </div>
                <h3>
                    Audio Visulization
                     <IconButton size = 'small' onClick={() => dispatch(submenu3())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>
                <Divider/>

                <div className="item-wrapper-record">
                    {audioVis ? "On" : "Off"}
                    <IconButton className="Play" color="inherit" size="large" onClick={() => dispatch(audiovis_flip())}>
                        {audioVis ? <PauseCircleFilledIcon className="pause"/> :
                            <PlayCircleFilledIcon className="start"/>}
                    </IconButton>
                </div>
                <h3>Instruction</h3>
                <Divider/>
                <div className='item-wrapper instruction'>
                    <SpringModal/>
                </div>

            </div>
        );
    } else {
        return (
            <div className="Options" id="options-space">
                <h2 style={{fontFamily: "Arial"}}>OPTIONS</h2>
                <h3>
                    Source
                    <IconButton size = 'small' onClick={() => dispatch(submenu2())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>

                <Divider/>

                <div className='item-wrapper'>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className="item-wrapper">
                    <PlusMinus item="Text size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className='item-wrapper'>
                    <ColorSpring/>
                </div>
                <div className='item-wrapper'>
                    <BoxSpring/>
                </div>
                <h3>
                    Audio Visulization
                     <IconButton size = 'small' onClick={() => dispatch(submenu3())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>
                <Divider/>
                <div className="item-wrapper-record">
                    {audioVis ? "On" : "Off"}
                    <IconButton className="Play" color="inherit" size="large" onClick={() => dispatch(audiovis_flip())}>
                        {audioVis ? <PauseCircleFilledIcon className="pause"/> :
                            <PlayCircleFilledIcon className="start"/>}
                    </IconButton>
                </div>

                <h3>Instruction</h3>
                <Divider/>
                <div className='item-wrapper instruction'>
                    <SpringModal/>
                </div>
            </div>
        );
    }
}
