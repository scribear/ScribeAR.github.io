import * as React from 'react';
import { 
   ApiStatus, RootState,
   API, ApiType, STATUS, StatusType
} from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { createTheme, ThemeProvider, ListItemButton, ListItemText, ListItemIcon, Collapse, ErrorIcon, ExpandLess, ExpandMore, CancelIcon, IconButton, DoNotDisturbOnIcon, CheckCircleIcon } from '../../../../muiImports' 

import AzureDropdown from './AzureDropdown';
import WhisperDropdown from './WhisperDropdown';


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

const IconStatus = (currentApi: any) => {
   const myTheme = currTheme;
   console.log(currentApi);
   switch (currentApi.currentApi) {
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
      webspeechStatus: false,
      whisperStatus: false,
      apiStatus: useSelector((state: RootState) => {
         return state.APIStatusReducer as ApiStatus;
      })
   });
   const toggleDrawer =
      (apiStat: string, api:ApiType, isArrow:boolean) =>
         (event: React.KeyboardEvent | React.MouseEvent) => {
               if (state.apiStatus.currentApi !== api) {
                  if (!isArrow && state.apiStatus[apiStat] === STATUS.AVAILABLE) {
                     let apiName = "Webspeech";
                     if (api === API.AZURE_TRANSLATION) {
                           apiName = "Microsoft Azure"
                     }
                     if (api === API.WHISPER) {
                        apiName = "Whisper"
                     }
                     swal({
                           title: "Success!",
                           text: "Switching to " + apiName,
                           icon: "success", 
                           timer: 2500,
                     
                        })
                     let copyStatus = Object.assign({}, state.apiStatus);
                     copyStatus.currentApi = api;
                     setState({ ...state, apiStatus: copyStatus });
                     dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
                  } else {
                     setState({ ...state, [apiStat]: !state[apiStat] });
                  }
               } else if (isArrow) {
                  setState({ ...state, [apiStat]: !state[apiStat] });
               }
         }
   return (
      <div>
         <ListItemButton onClick={toggleDrawer("webspeechStatus", 0, false)}>
               <ThemeProvider theme={myTheme}>
                  <ListItemIcon>
                     <IconStatus{...{currentApi: state.apiStatus.webspeechStatus}}/>
                  </ListItemIcon>
               </ThemeProvider>
               <ListItemText primary="Webspeech" />
         </ListItemButton>

         <ListItemButton onClick={toggleDrawer("azureStatus", 1, false)} >
               <ListItemIcon>
                  <IconStatus{...{currentApi: state.apiStatus.azureTranslStatus}}/>
               </ListItemIcon>
               <ListItemText primary="Microsoft Azure" />
               <IconButton onClick={toggleDrawer("azureStatus", 1, true)}>
                  {state.azureStatus ? <ExpandLess /> : <ExpandMore />}
               </IconButton>
         </ListItemButton>

         <ListItemButton onClick={toggleDrawer("whisperStatus", 4, false)} >
               <ListItemIcon>
                  <IconStatus{...{currentApi: state.apiStatus.whisperStatus}}/>
               </ListItemIcon>
               <ListItemText primary="Whisper" />
               <IconButton onClick={toggleDrawer("whisperStatus", 4, true)}>
                  {state.whisperStatus ? <ExpandLess /> : <ExpandMore />}
               </IconButton>
         </ListItemButton>

         <Collapse in={state.azureStatus} timeout="auto" unmountOnExit>
               <AzureDropdown apiStatus={state.apiStatus}/>
         </Collapse>

         <Collapse in={state.whisperStatus} timeout="auto" unmountOnExit>
               <WhisperDropdown apiStatus={state.apiStatus}/>
         </Collapse>
      </div>
   );
}