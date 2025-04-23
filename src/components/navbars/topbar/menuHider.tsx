import React from 'react'
import {  useDispatch } from 'react-redux'
import { IconButton, LockIcon, LockOpenIcon, Tooltip } from '../../../muiImports'
export default function MenuHider(props){
    const dispatch = useDispatch();

    return (
        <div>

            <Tooltip title={props.menuVisible ? "Lock Menu (Hide Options)" : "Unlock Menu (Show Options)"}>
                <IconButton
                        className="c2"
                        color="inherit"
                        onClick={() => dispatch({ type: 'HIDE_MENU' })}>
                            {props.menuVisible ? (
                                <LockIcon fontSize="large" />) : (
                                <LockOpenIcon fontSize="large" />)}
                </IconButton>
            </Tooltip>

        </div>
    )
}
