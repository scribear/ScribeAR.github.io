import React from 'react';

import Micvisual from '../TopSpace/Options/Micvisual/MicVisual';
import Stereovisual from '../TopSpace/Options/Stereo/Stereo';
import Divider from '@material-ui/core/Divider';
import {Button, IconButton} from "@material-ui/core"
import { useSelector, useDispatch } from 'react-redux'
import {audiovis_off} from '../../redux/actions'
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AdvanceMicSetting from './AdvanceMicSetting/AdvancedMicSetting.js'

import '../TopSpace/Options/Options.css'

export default function AudioOption (props){

    const dispatch = useDispatch()

    return (
        <div>
            <h2>Audio Setting</h2>
            <Divider />
            <div className="off_wrapper">
            <IconButton color='inherit' onClick={()=>(dispatch(audiovis_off()))}>
               <NotInterestedIcon fontSize="large"/>
            </IconButton>
                Turn Off Visualization
            </div>
            <h3>Mono</h3>
              <Divider/>
              <div className="item-wrapper">
             <Micvisual />
              </div>
              <h3>Stereo</h3>
            <Divider/>
            <div className="item-wrapper">
            <Stereovisual/>
            </div>
            <h3>Setting</h3>
            <Divider/>
            <div className="item-wrapper">
               <AdvanceMicSetting/>
            </div>
            {/*<h3>Setting</h3>*/}
            {/*<Divider/>*/}
            {/*<div className="item-wrapper">*/}
            {/*    Sensitivity*/}
            {/*</div>*/}
        </div>


    )
}
