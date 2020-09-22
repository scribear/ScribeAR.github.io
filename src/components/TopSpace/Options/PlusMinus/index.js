import React from 'react'
import styles from './index.module.css'
import { useSelector, useDispatch } from 'react-redux'
import ToggleButton from "../../../ToggleButton"


export default function PlusMinus(props) {
     const setting = useSelector(props.setting) // Get current value of the setting.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     const textC = props.item + ':' + parseFloat(setting).toFixed(1)
     return (
          <div className= {styles.itemwrapper}>
               <div className={styles.wordwrapper}>
                    {textC}
               </div>
               <div className = {styles.buttonwrapper}>
                    <ToggleButton color = "inherit" variant = "outlined" size = "small"
                      onClick={() => dispatch(props.decrement())}>-</ToggleButton>
                    <ToggleButton color = "inherit" variant = "outlined" size = "small"
                      onClick={() => dispatch(props.increment())}>+</ToggleButton>
              </div>
          </div>
     );
}
