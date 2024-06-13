import { WebVTTParser } from 'webvtt-parser';

import {useEffect, useState,Fragment}  from 'react';

import { Box,  IconButton, List, ListItem, Menu, SettingsIcon, TextField } from '../../../../muiImports'
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../store';
import { PlaybackStatus } from '../../../../react-redux&middleware/redux/types/apiTypes';

const parser = new WebVTTParser();

/**
 * Pop-up settings menu for the Stream recognizer
 * Allows user to change Stream event
 * @param props No props needed
 * @returns A pop-up menu in the center of the screen
 */
export default function PlaybackSettings(props) {

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const isShown = Boolean(anchorEl);

   const showPopup = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const dispatch = useDispatch()
   
   const closePopup = (event) => {
      event.preventDefault();
      setAnchorEl(null);
      dispatch({ type: 'CHANGE_PLAYBACK_STATUS', payload: playbackReactState });
   };

   const playbackStatus = useSelector((state: RootState) => {
      return state.PlaybackReducer as PlaybackStatus;
   })
   const [playbackReactState, setPlaybackReactState] = useState(playbackStatus);
   const [parsedCaption, setParsedCaption] = useState("");
   

   useEffect(() => { validateVttFile(); })

   const validateVttFile = () => {
      try {
         if(playbackReactState.captionFileContent.length > 0  ) {
            const {cues, errors} = parser.parse(playbackReactState.captionFileContent, 'chapters');
            if( errors.length > 0) {
               const lines = errors.map((e)=> {
                  const {message,line} = e; 
                  return `Line ${line}: ${message}`
               });

               setParsedCaption( `${lines.join('\n')}` );
            } else {
               setParsedCaption( `Valid VTT file. ${cues.length} cue${cues.length===1?'':'s'} found.`);
            }
         } else {
            setParsedCaption("");
         } 
      }
      catch (e) {
         setParsedCaption(`Could not validate VTT file:${e}`);
      }
   }

   const updateReactState = (event:any) => {
      setPlaybackReactState({...playbackReactState, [event.target.id]: event.target.value});
      
      validateVttFile();
      event.preventDefault();
   }
   

   return (
       <Fragment>
         
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

            <List component="div" disablePadding  sx={{ pl: 3, width:'100%' }}>
               <ListItem sx={{ pl: 3, width:'100%' }}>
                  <Box
                     component="form"
                     sx={{ width: '70vw',
                           '& > :not(style)': { pr: '0vw' },
                     }}
                     
                     noValidate
                     autoComplete="off"
                     onSubmit={closePopup} // Prevent default submission behavior of refreshing page
                  >
                     
                     <Box sx={{ color: 'text.primary', fontWeight: 'medium', padding: '1vw' }}>{parsedCaption}</Box>
                     <TextField
                        onChange={updateReactState}
                        value={playbackReactState.captionFileContent}
                        id="captionFileContent"
                        label="Timed Captions"
                        variant="outlined"
                        inputProps={{
                           placeholder: 'Caption file (vtt) contents',
                        }}
                        style={{ width: '45vw'}}
                        multiline
                        fullWidth   
                        
                     />
                  </Box>
               </ListItem>
            </List>

         </Menu>

       </Fragment>
   );
}