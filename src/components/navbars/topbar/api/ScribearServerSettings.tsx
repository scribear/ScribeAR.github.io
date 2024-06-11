import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScribearServerStatus,/* ApiStatus, ControlStatus, PhraseList */ } from '../../../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../../../store';

import { Box, TextField, Menu, List, ListItem, IconButton, SettingsIcon } from '../../../../muiImports'


/**
 * Pop-up settings menu for the ScribearServer recognizer
 * Allows user to change ScribearServer key and region
 * @param props No props needed
 * @returns A pop-up menu in the center of the screen
 */
export default function ScribearServerSettings(props) {

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const isShown = Boolean(anchorEl);

   /**
    * The new settings are buffered and only dispatched to redux store when the pop-up closes
    */
   const dispatch = useDispatch()
   const scribearServerStatus = useSelector((state: RootState) => {
      return state.ScribearServerReducer as ScribearServerStatus;
   })
   const [scribearServerStatusBuf, setscribearServerStatusBuf] = React.useState(scribearServerStatus)

   const showPopup = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const closePopup = (event) => {
      event.preventDefault();
      setAnchorEl(null);
      dispatch({ type: 'CHANGE_SCRIBEAR_SERVER_ADDRESS', payload: scribearServerStatusBuf });
   };

   const updateReact = (event) => {
      setscribearServerStatusBuf({...scribearServerStatusBuf, [event.target.id]: event.target.value})  
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
                     sx={{ width: '50vw',
                           '& > :not(style)': { pr: '1vw', width: '15vw' },
                     }}
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup} // Prevent default submission behavior of refreshing page
                  >
                    
                     <TextField
                        onChange={updateReact}
                        value={scribearServerStatusBuf.scribearServerAddress}
                        id="scribearServerAddress"
                        label="ScribeAR Server Address"
                        variant="outlined"
                        inputProps={{
                           placeholder: 'Enter ScribeAR Server Address e.g. localhost:1234',
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