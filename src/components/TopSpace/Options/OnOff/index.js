import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function OnOff(props) {
     const setting = useSelector(props.setting)
     const dispatch = useDispatch()
     return (
          <div className="row">
               <div className="col-8">
                    <p>{props.item}</p>
               </div>
               <div className="col-2 align-items-center">
                    <button
                      className={setting ? "btn btn-danger" : "btn btn-success"}
                      onClick={() => dispatch(props.action())}>
                         {setting ? 'OFF' : 'ON'}
                    </button>
               </div>
          </div>
     )
}
