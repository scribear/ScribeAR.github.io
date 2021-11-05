import * as React from 'react';
import List from '@mui/material/List';
import Button from "@mui/material/Button";
import ListItemText from '@mui/material/ListItemText';
import swal from 'sweetalert';
import { GetAzureRecognition } from './azureRecognition';
import ListItem from '@mui/material/ListItem';
import { ApiStatus, AzureStatus, ControlStatus } from '../../../redux/types';
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

export default function AzureDropdown(props) {
    const dispatch = useDispatch()
    const { pog, test } = GetAzureRecognition();

    const [state, setState] = React.useState({
        openAzure: false,
        azureStatus: useSelector((state: RootState) => {
            return state.AzureReducer as AzureStatus;
        }),
        controlStatus: useSelector((state: RootState) => {
            return state.ControlReducer as ControlStatus;
        }),
        apiStatus: props.apiStatus as ApiStatus
    });
    const handleChangeKey = (event) =>
     {
            let copyStatus = Object.assign({}, state.azureStatus);
            copyStatus[event.target.id] = event.target.value;
            setState({
                ...state, 
                azureStatus: copyStatus});
            dispatch({type: 'CHANGE_AZURE_LOGIN', payload: copyStatus})
            
    } 

    const toggleEnter = async () => {
        dispatch({type: 'FLIP_RECORDING', payload: state.controlStatus})
          const recognizedMessage = await test(state.controlStatus, state.azureStatus).then(response => {  
            let copyStatus = Object.assign({}, state.apiStatus);
            if (response === true) {
              copyStatus.azureStatus = 0;
              localStorage.setItem("azureStatus", JSON.stringify(state.azureStatus))
              swal({
                title: "Success!",
                text: "Switching to Microsoft Azure",
                icon: "success", 
                timer: 1500,
                buttons: {
                  no: {
                    text: "Cancel",
                    value: "no",
                  },    
                },
              })
              .then((value) => {
                switch (value) {
                  case "no":
                    setState({ ...state, openAzure: false })
                    break;
                  default:
                    copyStatus.currentAPI = 1;
                    dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
                }
              });
              setState({
                ...state, 
                apiStatus: copyStatus});
            } else {
              copyStatus.azureStatus = 2;   
              swal({
                title: "Warning!",
                text: "Wrong key or region!",
                icon: "warning",
              })
              setState({
                ...state, 
                apiStatus: copyStatus});     
            }

            dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
    
          }
        );  
        dispatch({type: 'FLIP_RECORDING', payload: state.controlStatus})
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
                        ><TextField onChange={handleChangeKey} value={state.azureStatus.azureKey} id="azureKey" label="Key" variant="outlined" /></Box>
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { mr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        ><TextField onChange={handleChangeKey} value={state.azureStatus.azureRegion} id="azureRegion" label="Region" variant="outlined" /></Box>
                    </ListItem>
                    <Button sx={{ pl: 4 }}>
                        <ListItemText primary="Enter" onClick={toggleEnter}/>
                    </Button>
                </List>
        </div>
    );
}