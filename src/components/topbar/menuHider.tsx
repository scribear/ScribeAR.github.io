import React,{ useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
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
