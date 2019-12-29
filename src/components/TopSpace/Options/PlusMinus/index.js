import React from 'react'
import './index.css'
import { useSelector, useDispatch } from 'react-redux'

export default function PlusMinus(props) {
     const setting = useSelector(props.setting) // Get current value of the setting.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     return (
          <div>
               {props.item}
               <div className="setting-wrapper">
                    <button className="minus"
                      onClick={() => dispatch(props.decrement())}>-</button>
                    <div className="setting">{setting}</div>
                    <button className="plus"
                      onClick={() => dispatch(props.increment())}>+</button>
               </div>
          </div>
     );
}
