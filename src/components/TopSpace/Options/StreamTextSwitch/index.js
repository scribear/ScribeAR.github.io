import React from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import {switch_to_streamtext} from '../../../../redux/actions'
import {Button} from '@material-ui/core'



export default function StreamTextKey(props) {
     //const streamtext_key = useSelector(props.streamtext)
     const dispatch = useDispatch()
     return (
       <Button className = "streamtextswitch" color = "inherit" onClick={() => dispatch(switch_to_streamtext())}>
          streamtext
       </Button>
     );
}
