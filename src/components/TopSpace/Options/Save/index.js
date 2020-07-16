import React from "react"
import {useSelector} from 'react-redux'
import {Button} from "@material-ui/core"
import './index.css'

function saveData(_text,_color,_mic,_box,_meh){
    localStorage.setItem('text',_text);
    localStorage.setItem('color',_color);
  //  localStorage.setItem('mic',_mic);
    localStorage.setItem('box',_box);
    localStorage.setItem('meh',_meh)
}


export default function Save() {
    const textSize = (state) => state.textSize
    const invertColors = (state) => state.invertColors
    const mic = (state) => state.mic
    const numLines = (state)=>state.numLines
    const meh = (state)=>state.meh

    const text_setting = useSelector(textSize)
    const color_setting = useSelector(invertColors)
    const mic_setting = useSelector(mic)
    const box_setting = useSelector(numLines)
    const meh_setting = useSelector(meh)


    return (
        <div className="outter-wrapper">
           Save Setting
        <div className = 'save-wrapper'>

            <Button color = 'inherit' variant = 'outlined' onClick = {()=>saveData(text_setting,color_setting,mic_setting,box_setting,meh_setting)}>Save</Button>
        </div>
        </div>
    )
}