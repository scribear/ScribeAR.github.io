import React from 'react'
import Record from './Record/Record.js'
import store from '../../../store'
import {useSelector, useDispatch} from "react-redux"
import Divider from '@material-ui/core/Divider';
import PlusMinus from './PlusMinus/PlusMinus.js'
// import StreamButton from './StreamTextSwitch'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import styles from './Options.module.css'
import SpringPop from '../../SpringPop/SpringPop.js'
import ToggleButton from '../../ToggleButton/ToggleButton.js'
import {
    increment_textSize,
    decrement_textSize,
    submenu3,
    submenu2,
    audiovis_flip,
    pick_white,
    pick_black,
    bot_1,
    bot_2,
    bot_3
} from '../../../redux/actions'
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import blackBg from '../../../image/black.png'
import whiteBg from '../../../image/white.png'
import full_pic from '../../../image/pic/fulltext.png'
import half_pic from '../../../image/pic/55.png'
import sub_pic from '../../../image/pic/subtitle.png'

const funcMap_bg = [
    pick_black,
    pick_white,
]

const imageMap_bg = [
    blackBg,
    whiteBg
]

const funcMap_bx = [
    bot_1,
    bot_2,
    bot_3
]

const imageMap_bx = [
    full_pic,
    half_pic,
    sub_pic,
]




export default function Options() {
    // These are functions that take an object and return an element of the object.
    // They are passed to useSelector, which feeds the global state object into them.
    const textSize = (state) => state.textSize
    const if_hide = useSelector((state) => state.botsize)
    const dispatch = useDispatch()
    var play_color = (if_hide === 0) ? 'disabled' : 'inherit';
    const bg_color = useSelector((state) => state.invertColors)
    const bot_size = useSelector((state) => state.botsize)

    const stereoSwitch = (state) => state.mic
    const audioVis = useSelector(stereoSwitch)

    const AudioVisual = () => (
        <div className={styles.audioWrapper}>
            <div className={styles.audioContent}>
                {audioVis && (if_hide !== 0) ? "On" : "Off"}
            </div>
            <ToggleButton type='Icon' className="Play" color="inherit" size="large" disabled = {(if_hide === 0)} onClick={() => dispatch(audiovis_flip())}>
                {audioVis && (if_hide !== 0) ? <PauseCircleFilledIcon className="pause" color = {play_color} /> :
                    <PlayCircleFilledIcon className={styles.Adplay} color = {play_color} />}
            </ToggleButton>
        </div>
    );

    if (store.isSuccessReducer === 'success') {
        return (
            <div className="Options" id="options-space">
                <h2 style={{fontFamily: "Arial"}}>OPTIONS</h2>
                <h3>
                    Source
                    <ToggleButton type='Icon' size = 'small' onClick={() => dispatch(submenu2())}>
                            <MoreHorizIcon />
                    </ToggleButton>
                </h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    <PlusMinus item="Text Size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className={styles.itemwrapper}>
                    <SpringPop type='switch' state={bg_color} functionMap={funcMap_bg} imageMap={imageMap_bg} >
                        Theme
                    </SpringPop>
                </div>
                <div className={styles.itemwrapper}>
                     <SpringPop type='switch' state={bot_size} functionMap={funcMap_bx} imageMap={imageMap_bx} >
                        Layout
                    </SpringPop>
                </div>
                {/* <div className={styles.itemwrapper}>
                    <StreamButton/>
                </div> */}
                <h3>
                    Audio Visulization
                     <ToggleButton type='Icon' size = 'small' onClick={() => dispatch(submenu3())}>
                        <MoreHorizIcon />
                    </ToggleButton>
                </h3>
                <Divider/>

                <div className={styles.itemwrapper}>
                    {AudioVisual()}
                </div>
                <h3>Instruction</h3>
                <Divider/>
                <div className={`${styles.itemwrapper} ${styles.instruction}`}>
                    <SpringPop title='Tutorial' type='display'>
                            -The text size button can be used to change size of
                                text shown in caption space.<br />
                                -There are 3 different graph can be toggled to help
                                reflex the surrounding voices by clicking forth button<br />
                                -For circular graph, try to drag it around.<br />
                                -To stop captioning just click switch button for Recording. Also
                                click again to resume captioning.<br />
                                -To memorize textsize option, click save after choosing a proper size of the text.
                    </SpringPop>
                </div>

            </div>
        );
    } else {
        return (
            <div className="Options" id="options-space">
                <h2 style={{fontFamily: "Arial"}}>OPTIONS</h2>
                <h3>
                    Source
                    <ToggleButton type='Icon' size = 'small' onClick={() => dispatch(submenu2())}>
                            <MoreHorizIcon />
                    </ToggleButton>
                </h3>

                <Divider/>

                <div className={styles.itemwrapper}>
                    <Record/>
                </div>
                <h3>Display</h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    <PlusMinus item="Text Size" setting={textSize}
                               increment={increment_textSize}
                               decrement={decrement_textSize}/>
                </div>
                <div className={styles.itemwrapper}>
                    <SpringPop type='switch' state={bg_color} functionMap={funcMap_bg} imageMap={imageMap_bg} >
                        Theme
                    </SpringPop>
                </div>
                <div className={styles.itemwrapper}>
                    <SpringPop type='switch' state={bot_size} functionMap={funcMap_bx} imageMap={imageMap_bx} >
                        Layout
                    </SpringPop>
                </div>
                {/* <div className={styles.itemwrapper}>
                    <StreamButton/>
                </div> */}
                <h3>
                    Audio Visulization
                    <ToggleButton type='Icon' size = 'small' onClick={() => dispatch(submenu2())}>
                            <MoreHorizIcon />
                    </ToggleButton>
                </h3>
                <Divider/>
                <div className={styles.itemwrapper}>
                    {AudioVisual()}
                </div>

                <h3>Instruction</h3>
                <Divider/>
                <div className={`${styles.itemwrapper} ${styles.instruction}`}>
                    <SpringPop title='Tutorial' type='display'>
                           -The text size button can be used to change size of
                            text shown in caption space.<br />
                            -There are 3 different graph can be toggled to help
                            reflex the surrounding voices by clicking forth button<br />
                            -For circular graph, try to drag it around.<br />
                            -To stop captioning just click switch button for Recording. Also
                            click again to resume captioning.<br />
                            -To memorize textsize option, click save after choosing a proper size of the text.
                    </SpringPop>
                </div>

            </div>
        );
    }
}
