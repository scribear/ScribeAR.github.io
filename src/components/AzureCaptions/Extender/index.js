import React from 'react'
import {IconButton} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
// import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
// import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ExpandLessSharpIcon from '@material-ui/icons/ExpandLessSharp';
import ExpandMoreSharpIcon from '@material-ui/icons/ExpandMoreSharp';

export default function Extender(props){
    const dispatch = useDispatch()
    return (
          <div style = {{
              bottom:0,
          }}>
                <IconButton color = 'inherit' onClick={() => dispatch(props.increment())}>
                    <ExpandLessSharpIcon />
                </IconButton>
                <IconButton color = 'inherit' onClick={() => dispatch(props.decrement())}>
                    <ExpandMoreSharpIcon />
                </IconButton>
            </div>
    )
}