import React from 'react'
import './index.css'
import { useSelector, useDispatch } from 'react-redux'
import {Button} from "@material-ui/core"
import PopMenu from '../../../PopMenu'
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function PlusMinus(props) {
     const setting = useSelector(props.setting) // Get current value of the setting.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     const textC = props.item + ':' + setting
     return (
          <div className= "textsize-wrapper">
               {textC}
               <div className = "setting_wrapper">
                    <Button className = "minus" color = "inherit" variant = "outlined" size = "small"
                      onClick={() => dispatch(props.decrement())}>-</Button>
                    <Button  className = "plus" color = "inherit" variant = "outlined" size = "small"
                      onClick={() => dispatch(props.increment())}>+</Button>
              </div>
          </div>
     );
}
