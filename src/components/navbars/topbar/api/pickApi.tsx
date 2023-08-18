import * as React from 'react';
import { 
   ApiStatus, RootState,
   API, ApiType, STATUS, StatusType, ControlStatus, AzureStatus
} from '../../../../react-redux&middleware/redux/typesImports';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { createTheme, ThemeProvider, ListItemButton, ListItemText, ListItemIcon, Collapse, ErrorIcon, ExpandLess, ExpandMore, CancelIcon, IconButton, DoNotDisturbOnIcon, CheckCircleIcon } from '../../../../muiImports' 

import WhisperDropdown from './WhisperDropdown';
import AzureSettings from './AzureSettings';
import { ListItem, ListItemSecondaryAction } from '@mui/material';
import { testAzureTranslRecog } from '../../../api/azure/azureTranslRecog';


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

/**
 * Icon component whose symbol and color represent the current availability of a given API
 * @param currentApi the API to represent
 * @returns The icon component
 */
const IconStatus = (currentApi: any) => {
   const myTheme = currTheme;
   switch (currentApi.currentApi) {
      case STATUS.AVAILABLE:
         return (
               <ThemeProvider theme={myTheme}>
                  <DoNotDisturbOnIcon/>
               </ThemeProvider>
         )
      
      case STATUS.TRANSCRIBING:
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

// Switch to azure -> keep api menu open -> cannot switch to webspeech
// Switch to azure -> reopen api menu -> can switch to webspeech -> webspeech doesn't work until microphone restarted
export default function PickApi(props) {
   const dispatch = useDispatch();
   const myTheme = currTheme;

   const apiStatus = useSelector((state: RootState) => {
      return state.APIStatusReducer as ApiStatus;
   })
   const controlStatus = useSelector((state: RootState) => {
      return state.ControlReducer as ControlStatus;
   })
   const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus;
   }) 

   const [state, setState] = React.useState({
      showAzureDropdown: false,
      showWhisperDropdown: false,
   });

   // TODO: change Whisper dropdown to pop-up as well
   // TODO: merge switchToAzure and toggleDrawer into one switch-to function
   const switchToAzure = async () => {
      dispatch({type: 'FLIP_RECORDING', payload: controlStatus});
      let copyStatus = Object.assign({}, apiStatus);
      testAzureTranslRecog(controlStatus, azureStatus).then(recognizer => { 
         // fullfill (test good)
         copyStatus.azureTranslStatus = STATUS.AVAILABLE;
         localStorage.setItem("azureStatus", JSON.stringify(azureStatus));
         
         copyStatus.currentApi = API.AZURE_TRANSLATION;
         copyStatus.azureTranslStatus = STATUS.AVAILABLE;
         swal({
               title: "Success!",
               text: "Switching to Microsoft Azure",
               icon: "success", 
               timer: 1500,
         })

         dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
      }, (error)=> {
         // reject (test bad)
         console.log("error");
         copyStatus.azureTranslStatus = STATUS.ERROR;   
         swal({
               title: "Warning!",
               text: `${error}`,
               icon: "warning",
         })
      }).finally(() => {
         dispatch({type: 'FLIP_RECORDING', payload: controlStatus})
      })
   }

   const toggleDrawer =
      (apiStat: string, api:ApiType, isArrow:boolean) =>
         (event: React.KeyboardEvent | React.MouseEvent) => {
               if (state.apiStatus.currentApi !== api) {
                  console.log(78);
                  if (!isArrow) {
                     let copyStatus = Object.assign({}, state.apiStatus);
                     copyStatus.currentApi = api;
                     let apiName = "Webspeech";
                     if (api === API.AZURE_TRANSLATION) {
                        apiName = "Microsoft Azure";
                        copyStatus.azureTranslStatus = STATUS.TRANSCRIBING;
                        copyStatus.webspeechStatus = STATUS.AVAILABLE;
                        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                        copyStatus.whisperStatus = STATUS.AVAILABLE;
                     } else if (api === API.WHISPER) {
                        apiName = "Whisper";
                        copyStatus.whisperStatus = STATUS.TRANSCRIBING
                        copyStatus.webspeechStatus = STATUS.AVAILABLE;
                        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                        copyStatus.azureTranslStatus = STATUS.AVAILABLE;
                     } else if (api === API.WEBSPEECH) {
                        copyStatus.webspeechStatus = STATUS.TRANSCRIBING
                        copyStatus.azureTranslStatus = STATUS.AVAILABLE;
                        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
                        copyStatus.whisperStatus = STATUS.AVAILABLE;
                     }
                     console.log(88, copyStatus);
                     setState({ ...state, apiStatus: copyStatus });
                     dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
                     swal({
                        title: "Success!",
                        text: "Switching to " + apiName,
                        icon: "success", 
                        timer: 2500,
                  
                     })
                  } else {
                     setState({ ...state, [apiStat]: !state[apiStat] });
                  }
               } else if (isArrow) {
                  setState({ ...state, [apiStat]: !state[apiStat] });
               }
         }

   return (
      <div>
         <ListItemButton onClick={toggleDrawer("webspeechStatus", API.WEBSPEECH, false)}>
               <ThemeProvider theme={myTheme}>
                  <ListItemIcon>
                     <IconStatus{...{currentApi: apiStatus.webspeechStatus}}/>
                  </ListItemIcon>
               </ThemeProvider>
               <ListItemText primary="Webspeech" />
         </ListItemButton>

         <ListItem>
            <ListItemButton disableGutters onClick={switchToAzure} >
               <ListItemIcon>
                  <IconStatus{...{currentApi: apiStatus.azureTranslStatus}}/>
               </ListItemIcon>
               <ListItemText primary="Microsoft Azure" />
            </ListItemButton>

            <AzureSettings/>
         </ListItem>

         <ListItemButton onClick={toggleDrawer("whisperStatus", API.WHISPER, false)} >
               <ListItemIcon>
                  <IconStatus{...{currentApi: apiStatus.whisperStatus}}/>
               </ListItemIcon>
               <ListItemText primary="Whisper" />
               <IconButton onClick={toggleDrawer("whisperStatus", API.WHISPER, true)}>
                  {state.whisperStatus ? <ExpandLess /> : <ExpandMore />}
               </IconButton>
         </ListItemButton>

         <Collapse in={state.showWhisperDropdown} timeout="auto" unmountOnExit>
               <WhisperDropdown apiStatus={apiStatus}/>
         </Collapse>
      </div>
   );
}