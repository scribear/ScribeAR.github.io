import React,{ useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton, LockIcon, LockOpenIcon } from '../../muiImports'
export default function MenuHider(props){
    const dispatch = useDispatch();



    return (
        <div>
            <IconButton className = "c2" color = "inherit" onClick = {()=>dispatch({type: 'HIDE_MENU'})}>
                {props.menuVisible ? <LockIcon/> : <LockOpenIcon/>}
            </IconButton>
        </div>
    )
}
