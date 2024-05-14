import * as React from 'react';

import { API, STATUS } from '../../../../react-redux&middleware/redux/types/apiEnums';
import { ApiStatus, AzureStatus, ControlStatus, PhraseList } from '../../../../react-redux&middleware/redux/typesImports';
import { Box, ClearIcon, IconButton, InputBase, List, ListItem, ListItemText, Menu, Paper, SettingsIcon, TextField } from '../../../../muiImports'
import { useDispatch, useSelector } from 'react-redux';
import {useEffect, useState} from 'react'

import { RootState } from '../../../../store';
import { StreamTextStatus } from '../../../../react-redux&middleware/redux/types/apiTypes';
import swal from 'sweetalert';
import { testAzureTranslRecog } from '../../../api/azure/azureTranslRecog';

/**
 * Pop-up settings menu for the Stream recognizer
 * Allows user to change Stream event
 * @param props No props needed
 * @returns A pop-up menu in the center of the screen
 */
export default function StreamTextSettings(props) {

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const isShown = Boolean(anchorEl);

   /**
    * The new settings are buffered and only dispatched to redux store when the pop-up closes
    */
   const dispatch = useDispatch()
   const streamTextStatus = useSelector((state: RootState) => {
      return state.StreamTextReducer as StreamTextStatus;
   })
   const [streamTextsBuf, setStreamTextStatusBuf] = React.useState(streamTextStatus)

   const showPopup = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const closePopup = (event) => {
      event.preventDefault();
      setAnchorEl(null);
      dispatch({ type: 'CHANGE_STREAMTEXT_STATUS', payload: streamTextsBuf });
   };
   const updateBuf = (event) => {
      setStreamTextStatusBuf({...streamTextsBuf, [event.target.id]: event.target.value})
   }

   useEffect(() => {
      // Set the initial value for startPosition and call updateBuf
      if (streamTextStatus.startPosition === undefined) {
        updateBuf({ target: { id: 'startPosition', value: -1 } });
      }
    }, []);
  

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
                           '& > :not(style)': { pr: '1vw', width: '30vw' },
                     }}
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup} // Prevent default submission behavior of refreshing page
                  >
                     <style>
                           {`
                              #streamTextEvent {
                              width: '100%';
                              }
                           `}
                     </style>
                     <TextField
                        onChange={updateBuf}
                        value={streamTextsBuf.streamTextEvent}
                        id="streamTextEvent"
                        label="event"
                        variant="outlined"
                        inputProps={{
                           placeholder: 'Enter Stream Text event here',
                        }}
                        style={{ width: '100%' }}
                     />
                  </Box>
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <Box
                     component="form"
                     sx={{
                           '& > :not(style)': { pr: '1vw', width: '30vw' },
                     }}
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup} // Prevent default submission behavior of refreshing page
                  >
                     <style>
                           {`
                              #startPosition {
                              width: '100%';
                              }
                           `}
                     </style>
                     <TextField
                        onChange={updateBuf}
                        value={streamTextsBuf.startPosition}
                        id="startPosition"
                        label="position"
                        variant="outlined"
                        inputProps={{
                           placeholder: '-1 means current position, 0 means from the start',
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