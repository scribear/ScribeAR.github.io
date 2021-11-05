import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Button from "@mui/material/Button";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ErrorIcon from '@mui/icons-material/Error';
import swal from 'sweetalert';
import { ApiStatus, RootState} from '../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AzureDropdown from './azure/AzureDropdown';

enum STATUS {
    "AVAILABLE",
    "NULL",
    "UNAVAILABLE",
    "INPROGRESS",
    "ERROR"
}

const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        success: {
            main: '#4caf50'
        },
        warning: {
            main: '#f44336'
        }, 
        error: {
            main: '#C8C224'
        }
    }
});
const IconStatus = (currentAPI: any) => {
    const myTheme = currTheme;
    switch (currentAPI.currentAPI) {
        case STATUS.NULL:
            return(
                <ThemeProvider theme={myTheme}>
                    <DoNotDisturbOnIcon/>
                </ThemeProvider>
            )
        
        case STATUS.AVAILABLE:
            return(
                <ThemeProvider theme={myTheme}>
                    <CheckCircleIcon color="success" />
                </ThemeProvider>
            )       
        case STATUS.UNAVAILABLE:
            return (
                <ThemeProvider theme={myTheme}>
                    <CancelIcon color="warning"/>
                </ThemeProvider>
            )
        }
        return (
            <ThemeProvider theme={myTheme}>
                <ErrorIcon color="error"/>
            </ThemeProvider>
        )
}
export default function STT(props) {
    const dispatch = useDispatch()
    const myTheme = currTheme

    const [state, setState] = React.useState({
        azureStatus: false,
        streamTextStatus: false,
        webspeechStatus: false,
        apiStatus: useSelector((state: RootState) => {
            return state.APIStatusReducer as ApiStatus;
        })
    });
    const toggleDrawer =
        (apiStat: string, api:number, isArrow:boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (state.apiStatus.currentAPI !== api) {
                    if (!isArrow && state.apiStatus[apiStat] === 0) {
                        let apiName = "Webspeech";
                        if (api == 1) {
                            apiName = "Microsoft Azure"
                        } else if (api == 2) {
                            apiName = "Streamtext"
                        }
                        swal({
                            title: "Success!",
                            text: "Switching to " + apiName,
                            icon: "success", 
                            timer: 2500,
                        
                          })
                        let copyStatus = Object.assign({}, state.apiStatus);
                        copyStatus.currentAPI = api
                        setState({ ...state, apiStatus: copyStatus })
                        dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus})
                    } else {
                        setState({ ...state, [apiStat]: !state[apiStat] })
                    }
                } else if (isArrow) {
                    setState({ ...state, [apiStat]: !state[apiStat] })
                }
            }
    return (
        <div>
            <ListItemButton onClick={toggleDrawer("webspeechStatus", 0, false)}>
                <ThemeProvider theme={myTheme}>
                    <ListItemIcon>
                        <IconStatus{...{currentAPI: state.apiStatus.webspeechStatus}}/>
                    </ListItemIcon>
                </ThemeProvider>
                <ListItemText primary="Webspeech" />
            </ListItemButton>

            <ListItemButton onClick={toggleDrawer("azureStatus", 1, false)} >
            <ListItemIcon>
                    <IconStatus{...{currentAPI: state.apiStatus.azureStatus}}/>
                </ListItemIcon>
                <ListItemText primary="Microsoft Azure" />
                <IconButton onClick={toggleDrawer("azureStatus", 1, true)}>
            {state.streamTextStatus ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
            </ListItemButton>

            <Collapse in={state.azureStatus} timeout="auto" unmountOnExit>
                <AzureDropdown apiStatus={state.apiStatus}/>
            </Collapse>

            <ListItemButton onClick={toggleDrawer("streamTextStatus", 2, false)} >
                <ListItemIcon>
                    <IconStatus{...{currentAPI: state.apiStatus.streamtextStatus}}/>
                </ListItemIcon>
                <ListItemText primary="StreamText" />
                <IconButton>
            {state.streamTextStatus ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
            </ListItemButton>
            <Collapse in={state.streamTextStatus} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { mr: '1vw', width: '15vw' },
                            }}
                            noValidate
                            autoComplete="off"
                        ><TextField id="outlined-basic" label="Key" variant="outlined" /></Box>
                    </ListItem>
                    <Button sx={{ pl: 4 }}>
                        <ListItemText primary="Enter" />
                    </Button>
                </List>
            </Collapse>
        </div>
    );
}