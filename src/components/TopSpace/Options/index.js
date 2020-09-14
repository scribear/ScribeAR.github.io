import React from 'react'
import Record from './Record'
import store from '../../../store'
import {useSelector, useDispatch} from "react-redux"
import Divider from '@material-ui/core/Divider';
import PlusMinus from './PlusMinus'
import {Button, IconButton} from '@material-ui/core';
import SpringModal from './SpringModal'
import ColorSpring from './ColorSpring'
import BoxSpring from './BoxSpring'
import SwitchAPI from '../../SwitchAPI'
import StreamButton from './StreamTextSwitch'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';//----------------------------------------------------------
import styles from './index.module.css'



import {
    increment_textSize,
    decrement_textSize,
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
    const if_ins = useSelector((state) => state.ins)
    const if_hide = useSelector((state) => state.botsize)
    const dispatch = useDispatch()
    var choice = if_ins ? 'appear' : 'disappear';
    var play_color = (if_hide === 0) ? 'disabled' : 'inherit';


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
                <div className={styles.itemwrapper}>
                    <SwitchAPI/>
                </div>
                <div className={styles.itemwrapper}>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    <PlusMinus item="Text size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className={styles.itemwrapper}>
                    <ColorSpring/>
                </div>
                <div className={styles.itemwrapper}>
                    <BoxSpring/>
                </div>
                <div className={styles.itemwrapper}>
                    <StreamButton/>
                </div>
                <h3>
                    Audio Visulization
                     <IconButton size = 'small' onClick={() => dispatch(submenu3())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>
                <Divider/>

                <div className={styles.itemwrapper}>
                    {audioVis && (if_hide !== 0) ? "On" : "Off"}
                    <IconButton className="Play" color="inherit" size="large" disabled = {(if_hide === 0)} onClick={() => dispatch(audiovis_flip())}>
                        {audioVis && (if_hide !== 0) ? <PauseCircleFilledIcon className="pause" color = {play_color} /> :
                            <PlayCircleFilledIcon className="start" color = {play_color} />}
                    </IconButton>
                </div>
                <h3>Instruction</h3>
                <Divider/>
                <div className={`${styles.itemwrapper} ${styles.instruction}`}>
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

                <div className={styles.itemwrapper}>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    <PlusMinus item="Text size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className={styles.itemwrapper}>
                    <ColorSpring/>
                </div>
                <div className={styles.itemwrapper}>
                    <BoxSpring/>
                </div>
                <div className={styles.itemwrapper}>
                    <StreamButton/>
                </div>
                <h3>
                    Audio Visulization
                     <IconButton size = 'small' onClick={() => dispatch(submenu3())}>
                        <MoreHorizIcon />
                    </IconButton>
                </h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    {audioVis && (if_hide !== 0) ? "On" : "Off"}
                    <IconButton className="Play" color="inherit" size="large" disabled = {(if_hide === 0)} onClick={() => dispatch(audiovis_flip())}>
                        {audioVis && (if_hide !== 0) ? <PauseCircleFilledIcon className="pause" color = {play_color} /> :
                            <PlayCircleFilledIcon className="start" color = {play_color} />}
                    </IconButton>
                </div>

                <h3>Instruction</h3>
                <Divider/>
                <div className={`${styles.itemwrapper} ${styles.instruction}`}>
                    <SpringModal/>
                </div>
            </div>
        );
    }
}
