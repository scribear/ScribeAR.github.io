import React from 'react'
import {  useDispatch } from 'react-redux'
import { IconButton, Lock, LockOpen } from '../../../muiImports'
export default function MenuHider(props){
    const dispatch = useDispatch();

    return (
        <div>
            <IconButton className = "c2" color = "inherit" onClick = {()=>dispatch({type: 'HIDE_MENU'})}>
                {props.menuVisible ? <Lock fontSize="large"/> : <LockOpen fontSize="large"/>}
            </IconButton>
        </div>
    )
}
