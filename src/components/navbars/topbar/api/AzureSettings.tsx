import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiStatus, AzureStatus, ControlStatus, PhraseList } from '../../../../react-redux&middleware/redux/typesImports';
import { STATUS, API } from '../../../../react-redux&middleware/redux/types/apiEnums';
import { RootState } from '../../../../store';

import swal from 'sweetalert';
import { Box, TextField, Menu, List, ListItem, IconButton, SettingsIcon, Paper, InputBase, ListItemText, ClearIcon } from '../../../../muiImports'

import { testAzureTranslRecog } from '../../../api/azure/azureTranslRecog';



/**
 * Pop-up settings menu for the Azure recognizer
 * Allows user to change Azure key and region
 * @param props No props needed
 * @returns A pop-up menu in the center of the screen
 */
export default function AzureSettings(props) {

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const isShown = Boolean(anchorEl);

   /**
    * The new settings are buffered and only dispatched to redux store when the pop-up closes
    */
   const dispatch = useDispatch()
   const azureStatus = useSelector((state: RootState) => {
      return state.AzureReducer as AzureStatus;
   })
   const [azureStatusBuf, setAzureStatusBuf] = React.useState(azureStatus)

   const showPopup = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const closePopup = (event) => {
      event.preventDefault();
      setAnchorEl(null);
      dispatch({ type: 'CHANGE_AZURE_LOGIN', payload: azureStatusBuf });
   };
   const updateBuf = (event) => {
      setAzureStatusBuf({...azureStatusBuf, [event.target.id]: event.target.value})  
   }

   return (
       <React.Fragment>
         
         <IconButton onClick={showPopup}>
               <SettingsIcon />
         </IconButton>

         <Menu
            anchorEl={anchorEl}
            open={isShown}
            onClose={closePopup}
            PaperProps={{
                  elevation: 0,
                  sx: {
                     position: 'unset',
                     ml: '25vw',
                     width: '50vw',
                     mt: '25vh',
                     height: '50vh',
                     filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  },
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
         >

            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <Box
                     component="form"
                     sx={{
                           '& > :not(style)': { pr: '1vw', width: '15vw' },
                     }}
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup} // Prevent default submission behavior of refreshing page
                  >
                     <style>
                           {`
                              #azureKey {
                              width: '100%';
                              }
                           `}
                     </style>
                     <TextField
                        onChange={updateBuf}
                        value={azureStatusBuf.azureKey}
                        id="azureKey"
                        label="Key"
                        variant="outlined"
                        inputProps={{
                           placeholder: 'Enter Azure key here',
                        }}
                        style={{ width: '100%' }}
                     />
                  </Box>
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <Box
                     component="form"
                     sx={{
                           '& > :not(style)': { mr: '1vw', width: '15vw' },
                     }}
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup}
                  >
                     <TextField 
                        onChange={updateBuf} 
                        value={azureStatusBuf.azureRegion} 
                        id="azureRegion" 
                        label="Region" 
                        variant="outlined"
                        inputProps={{
                           placeholder: 'Enter Azure key here',
                        }}
                        style={{ width: '100%' }}
                     />
                  </Box>
               </ListItem>
            </List>

         </Menu>

       </React.Fragment>
   );
}