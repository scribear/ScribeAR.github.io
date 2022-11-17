import * as React from 'react';
import { ApiStatus, RootState} from '../../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { createTheme, ThemeProvider, ListItemButton, ListItemText, ListItemIcon, Collapse, ErrorIcon, ExpandLess, ExpandMore, CancelIcon, IconButton, DoNotDisturbOnIcon, CheckCircleIcon } from '../../../../muiImports' 

// import StreamTextDropdown from './streamtext/streamTextDropdown';
import AzureDropdown from './AzureDropdown';

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
            return (
                <ThemeProvider theme={myTheme}>
                    <DoNotDisturbOnIcon/>
                </ThemeProvider>
            )
        
        case STATUS.AVAILABLE:
            return (
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

export default function PickApi(props) {
    const dispatch = useDispatch();
    const myTheme = currTheme;

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
                    {state.azureStatus ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </ListItemButton>

            <Collapse in={state.azureStatus} timeout="auto" unmountOnExit>
                <AzureDropdown apiStatus={state.apiStatus}/>
            </Collapse>

            {/* <ListItemButton onClick={toggleDrawer("streamTextStatus", 2, false)} >
                <ListItemIcon>
                    <IconStatus{...{currentAPI: state.apiStatus.streamtextStatus}}/>
                </ListItemIcon>
                <ListItemText primary="StreamText" />
                <IconButton onClick={toggleDrawer("streamTextStatus", 2, true)}>
                    {state.streamTextStatus ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </ListItemButton>

            <Collapse in={state.streamTextStatus} timeout="auto" unmountOnExit>
                <StreamTextDropdown apiStatus={state.apiStatus}/>
            </Collapse> */}
        </div>
    );
}