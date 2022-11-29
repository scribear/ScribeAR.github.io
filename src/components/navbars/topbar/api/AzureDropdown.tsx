import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiStatus, AzureStatus, ControlStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { STATUS, API } from '../../../../react-redux&middleware/redux/types/apiEnums';
import { RootState } from '../../../../store';

import swal from 'sweetalert';
import { Box, TextField, List, ListItem } from '../../../../muiImports'

import { GetuseAzureTranslRecog } from '../../../api/azure/azureRecognition';
import { testAzureTranslRecog } from '../../../api/azure/azureTranslRecog';

// import '../../swal.css';


export default function AzureDropdown(props) {
   const dispatch = useDispatch()
   // const { pog, test } = GetuseAzureTranslRecog();

   // const azureStatus : AzureStatus = useSelector((state: RootState) => {
   //     return state.AzureReducer as AzureStatus;
   // });
   // const controlStatus : ControlStatus = useSelector((state: RootState) => {
   //     return state.ControlReducer as ControlStatus;
   // });
   // const apiStatus : ApiStatus = props.apiStatus;
   const [state, setState] = React.useState({
      azureStatus: useSelector((state: RootState) => {
         return state.AzureReducer as AzureStatus;
      }),
      controlStatus: useSelector((state: RootState) => {
         return state.ControlReducer as ControlStatus;
      }),
      apiStatus: props.apiStatus as ApiStatus
   });

   const handleChangeKey = (event) => {
      console.log("key change", event.target.id);
      let copyStatus = Object.assign({}, state.azureStatus);
      copyStatus[event.target.id] = event.target.value;

      setState({ ...state, azureStatus: copyStatus });
      dispatch({ type: 'CHANGE_AZURE_LOGIN', payload: copyStatus });
   } 

   const handleEnter = (event) => {
      if (event.key === 'Enter') { // if pressed the "return" key
         toggleEnter()
         event.preventDefault();
      }
   }

   const toggleEnter = async () => {
      dispatch({type: 'FLIP_RECORDING', payload: state.controlStatus});
      let copyStatus = Object.assign({}, state.apiStatus);
      testAzureTranslRecog(state.controlStatus, state.azureStatus).then(recognizer => { 
         // fullfill (test good)
         copyStatus.azureTranslStatus = STATUS.AVAILABLE;
         localStorage.setItem("azureStatus", JSON.stringify(state.azureStatus));
         
         swal({
               title: "Success!",
               text: "Switching to Microsoft Azure",
               icon: "success", 
               timer: 1500,
               buttons: {
                  no: { text: "Cancel", value: "no" },    
               },
         }).then((value) => {
               switch (value) {
                  case "no":
                     // setState({ ...state }); // is it necessary?
                     break;
                  default:
                     copyStatus.currentApi = API.AZURE_TRANSLATION;
                     copyStatus.azureTranslStatus = STATUS.INPROGRESS;
               }
         });

         dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
         setState({ ...state, apiStatus: copyStatus});
      }, (error)=> {
         // reject (test bad)
         console.log("error");
         copyStatus.azureTranslStatus = STATUS.ERROR;   
         swal({
               title: "Warning!",
               text: `${error}`,
               icon: "warning",
         })

         dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
         setState({ ...state, apiStatus: copyStatus });  
      });
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
                     autoComplete="off">
                     <style>
                           {`
                              #azureKey {
                              width: '100%';
                              }
                           `}
                     </style>
                     <TextField onKeyDown={handleEnter} onChange={handleChangeKey} value={state.azureStatus.azureKey} id="azureKey" label="Key" variant="outlined" style={{ width: '100%' }}/>
                  </Box>
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <Box
                     component="form"
                     sx={{
                           '& > :not(style)': { mr: '1vw', width: '15vw' },
                     }}
                     noValidate
                     autoComplete="off">
                     <TextField onKeyDown={handleEnter} onChange={handleChangeKey} value={state.azureStatus.azureRegion} id="azureRegion" label="Region" variant="outlined" style={{ width: '100%' }}/></Box>
               </ListItem>
         </List>
      </div>
   );
}