import * as React from 'react';
import List from '@mui/material/List';
import swal from 'sweetalert';
import StreamText from './streamtextRecognition';
import ListItem from '@mui/material/ListItem';
import { ApiStatus, StreamTextStatus, ControlStatus } from '../../../redux/types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';


enum STATUS {
    "AVAILABLE",
    "NULL",
    "UNAVAILABLE",
    "INPROGRESS",
    "ERROR"
}

export default function StreamTextDropdown(props) {
    const dispatch = useDispatch()

    const [state, setState] = React.useState({
        openstreamText: false,
        streamTextStatus: useSelector((state: RootState) => {
            return state.StreamTextReducer as StreamTextStatus;
        }),
        controlStatus: useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        }),
        apiStatus: props.apiStatus as ApiStatus
    });
    const handleChangeKey = (event) =>
     {
            let copyStatus = Object.assign({}, state.streamTextStatus);
            copyStatus[event.target.id] = event.target.value;
            setState({
                ...state, 
                streamTextStatus: copyStatus});
            dispatch({type: 'CHANGE_STREAMTEXT_LOGIN', payload: copyStatus})
            
    } 
    const handleEnter = (event) =>
    {
      if (event.key === 'Enter') {
        toggleEnter()
        event.preventDefault();
      }
    }
    const toggleEnter = () => {
      let copyStatus2 = Object.assign({}, state.controlStatus);
      copyStatus2.listening = false
        dispatch({type: 'FLIP_RECORDING', payload: copyStatus2})
        let copyStatus = Object.assign({}, state.apiStatus);
        swal({
          title: "Success!",
          text: "Switching to StreamText",
          icon: "success", 
          timer: 1500,
          buttons: {
            no: {
              text: "Cancel",
              value: "no",
            },    
          },
        })
        copyStatus.streamtextStatus = 0
        copyStatus.currentAPI = 2
        dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
    
          }
    
    return (
        <div>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { pr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        ><TextField onKeyDown = {handleEnter} onChange={handleChangeKey} value={state.streamTextStatus.streamTextKey} id="streamTextKey" label="Key" variant="outlined" /></Box>
                    </ListItem>
                </List>
        </div>
    );
}