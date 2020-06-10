import React from 'react'
import './index.css'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@material-ui/core';

export default function PlusMinus(props) {
     const setting = useSelector(props.setting) // Get current value of the setting.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     return (
          <div>
               {props.item + ":"}
               <div className="plus-and-minus">
                 <div className="setting">{setting}</div>

                    <Button variant="outlined" className="minus"
                      onClick={() => dispatch(props.decrement())}> - </Button>
                    <Button variant="outlined" className="plus"
                      onClick={() => dispatch(props.increment())}> + </Button>
               </div>
          </div>
     );
}
