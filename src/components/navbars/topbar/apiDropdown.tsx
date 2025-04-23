import * as React from 'react';
import { useEffect } from "react";
import { Box, Menu, ExpandLess, ExpandMore, ThemeProvider, IconButton, Tooltip } from '../../../muiImports';
import { createTheme, useMediaQuery } from '@mui/material';

import PickApi from './api/pickApi';
import {
  API,
  ApiStatus,
  RootState,
  STATUS
} from "../../../react-redux&middleware/redux/typesImports";
import { useDispatch, useSelector } from "react-redux";
import { ScribearServerStatus } from '../../../react-redux&middleware/redux/typesImports';

const currTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
});

export default function ApiDropdown(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const serverAddress = urlParams.get('serverAddress');
  const accessToken = urlParams.get('accessToken');

  const apiStatus = useSelector((state: RootState) => state.APIStatusReducer as ApiStatus);
  const scribearServerStatus = useSelector((state: RootState) => {
    return state.ScribearServerReducer as ScribearServerStatus
  })

  function switchToScribeARServer(scribearServerAddress: string) {
      // Set new scribear server address
      let copyScribearServerStatus = Object.assign({}, scribearServerStatus);
      copyScribearServerStatus.scribearServerAddress = scribearServerAddress
  
      dispatch({type: 'CHANGE_SCRIBEAR_SERVER_ADDRESS', payload: copyScribearServerStatus});
      
    // Switch to scribear server
    let copyStatus = Object.assign({}, apiStatus);
    copyStatus.currentApi = API.SCRIBEAR_SERVER;
    copyStatus.webspeechStatus = STATUS.AVAILABLE;
    copyStatus.azureConvoStatus = STATUS.AVAILABLE;
    copyStatus.whisperStatus = STATUS.AVAILABLE;
    copyStatus.streamTextStatus = STATUS.AVAILABLE;
    copyStatus.playbackStatus = STATUS.AVAILABLE;
    copyStatus.scribearServerStatus = STATUS.TRANSCRIBING;

    dispatch({type: 'CHANGE_API_STATUS', payload: copyStatus});
  }

  // Automatically use scribear server as sink when in student mode or as sourcesink if in kiosk mode
  useEffect(() => {
    if (mode === 'kiosk') {
      switchToScribeARServer(`ws:${serverAddress}/sourcesink`);
    } else if (mode === 'student' && accessToken) {
      console.log("Sending startSession POST with accessToken:", accessToken);
      fetch(`http://${serverAddress}/startSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Session token:', data.sessionToken);

          const scribearServerAddress = `ws://${serverAddress}/sink?sessionToken=${encodeURIComponent(data.sessionToken)}`;

          switchToScribeARServer(scribearServerAddress);
        })
        .catch(error => {
          console.error('Error starting session:', error);
        });
    }
  }, [accessToken]);

  const isMobile = useMediaQuery(currTheme.breakpoints.down('sm'));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Make this a dropdown menu with the current api as the menu title
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center'}}>
        {props.apiDisplayName}
        <Tooltip title="API choice">
          <IconButton onClick={handleClick}>
            <ThemeProvider theme={currTheme}>
              {open ? <ExpandLess color="primary" fontSize="large" /> : <ExpandMore color="primary" fontSize="large" />}
            </ThemeProvider>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: isMobile ? '75%' : '30vw',
            overflow: 'invisible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              boxSizing: "border-box",
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: '48%',
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <PickApi/>
      </Menu>
    </React.Fragment>
  );
}
