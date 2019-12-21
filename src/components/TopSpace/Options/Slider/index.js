import React from 'react'
import './index.css'
import { useSelector, useDispatch } from 'react-redux'

export default function Slider(props) {
     const setting = useSelector(props.setting)
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
