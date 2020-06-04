import React from "react"
import {useSelector} from 'react-redux'
import {Button} from "@material-ui/core"
import './index.css'

function saveData(_setting){
    localStorage.setItem('text',_setting);
}


export default function Save() {
    const textSize = (state) => state.textSize
    const setting = useSelector(textSize)


    return (
        <div className = 'save-wrapper'>
            <Button color = 'inherit' variant = 'outlined' onClick = {()=>saveData(setting)}>Save</Button>
        </div>
    )
}