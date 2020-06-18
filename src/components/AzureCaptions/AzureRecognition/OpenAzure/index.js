
import React from 'react'
import './index.css'
import { /*useSelector, */useDispatch } from 'react-redux'

// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function SwitchMenus(props) {
     //const setting = useSelector(props.setting)
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()

     return (
          <div>
               {props.item}
               <label className="switch">
                    <input type="checkbox" onChange={() => dispatch(props.action())}></input>
                    <span className="slider"></span>
               </label>
          </div>
     )
}
