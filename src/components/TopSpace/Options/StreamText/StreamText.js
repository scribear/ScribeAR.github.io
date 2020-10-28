import React from 'react';
import {TextInput} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux'
import {set_streamtext_key} from '../../../../redux/actions'

export default function StreamTextKey(props) {
     const streamtext_key = useSelector(props.streamtext) // Get current value of the setting.
     // useDispatch returns the state modifying function, invoked below.
     const dispatch = useDispatch()
     return (
          <div>
              <div className = "streamtext_key">
                  <TextInput onChange = {(event) => {dispatch(set_streamtext_key(event.text))}}/>
              </div>
          </div>
     );
}