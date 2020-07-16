import React from 'react';
import VisualControl from '../TopSpace/Options/VisualControl';
import Micvisual from '../TopSpace/Options/Micvisual';
import Stereovisual from '../TopSpace/Options/Stereo';
import Divider from '@material-ui/core/Divider';

import '../TopSpace/Options/index.css'

export default function AudioOption (props){
    
    return (
        <div>
            <h2>Audio Setting</h2>
            <Divider />
            <div className = 'item-wrapper'>
                 <VisualControl />
            </div>
            <div className="item-wrapper">
                <Micvisual />
            </div>
            <div className="item-wrapper">
                <Stereovisual/>
            </div>
        </div>


    )
}