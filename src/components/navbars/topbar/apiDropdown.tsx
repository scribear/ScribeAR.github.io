import * as React from 'react';
import { useEffect } from "react";
import { Box, Menu, ExpandLess, ExpandMore, ThemeProvider, IconButton, Tooltip } from '../../../muiImports';
import {
  createTheme,
  useMediaQuery,
  useTheme
} from '@mui/material';

import PickApi from './api/pickApi';
import {
  API,
  ApiStatus,
  RootState,
  STATUS
} from "../../../react-redux&middleware/redux/typesImports";
import { useDispatch, useSelector } from "react-redux";
// import Theme from '../../theme';
import { ScribearServerStatus,/* ApiStatus, ControlStatus, PhraseList */ } from '../../../react-redux&middleware/redux/typesImports';

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
  const serverParam = urlParams.get('server');
  const serverAddress = urlParams.get('serverAddress');
  const accessToken = urlParams.get('accessToken');
  const [sessionToken, setSessionToken] = React.useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      console.log("Sending startSession POST with accessToken:", accessToken);
      fetch('http://localhost:8080/startSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken })
      })
      .then(response => response.json())
      .then(data => {
        setSessionToken(data.sessionToken); //updates the state
        console.log('Session token:', data.sessionToken);
        // If you want to persist it:
        // localStorage.setItem('sessionToken', sessionToken);
      })
      .catch(error => {
        console.error('Error starting session:', error);
      });
    }
  }, [accessToken]);
  const scribearServerStatus = useSelector((state: RootState) => {
        return state.ScribearServerReducer as ScribearServerStatus;
     })
     const [scribearServerStatusBuf, setscribearServerStatusBuf] = React.useState(scribearServerStatus)

  let selectedApi;
  // console.log(serverParam)
  if (serverParam === 'scribear-server') {
    selectedApi = 'ScribearServer';
  } else {
    selectedApi = 'WebSpeech'; // Default if no server is specified
  }
  const apiStatus = useSelector((state: RootState) => state.APIStatusReducer as ApiStatus);
  // const theme = useTheme();
  const isMobile = useMediaQuery(currTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (sessionToken && serverAddress) {
      const updatedAddress = `${serverAddress}?sessionToken=${encodeURIComponent(sessionToken)}`;
      console.log("Updated server address with session token:", updatedAddress);
      setscribearServerStatusBuf(prev => ({ ...prev, scribearServerAddress: updatedAddress }));
    }
  }, [sessionToken, serverAddress]);

  useEffect(() => {
      if (scribearServerStatusBuf.scribearServerAddress) {
          console.log("Dispatching updated address:", scribearServerStatusBuf);
          dispatch({ type: 'CHANGE_SCRIBEAR_SERVER_ADDRESS', payload: scribearServerStatusBuf });
      }
  }, [scribearServerStatusBuf, dispatch]);


  useEffect(() => {
    let copyStatus = { ...apiStatus };

    switch (selectedApi) {
      case "ScribearServer":
        copyStatus.currentApi = API.SCRIBEAR_SERVER;
        copyStatus.webspeechStatus = STATUS.AVAILABLE;
        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
        copyStatus.whisperStatus = STATUS.AVAILABLE;
        copyStatus.streamTextStatus = STATUS.AVAILABLE;
        copyStatus.playbackStatus = STATUS.AVAILABLE;
        copyStatus.scribearServerStatus = STATUS.TRANSCRIBING;
        console.log(serverAddress)
        if (serverAddress) {
          console.log("Updating serverAddress:", serverAddress);
          setscribearServerStatusBuf(prev => ({ ...prev, scribearServerAddress: serverAddress }));
        }
        localStorage.setItem("scribearServerStatus", JSON.stringify(copyStatus.scribearServerStatus));
        break;

      default:
        copyStatus.currentApi = API.WEBSPEECH; // Default to WebSpeech
        copyStatus.webspeechStatus = STATUS.AVAILABLE;
        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
        copyStatus.scribearServerStatus = STATUS.AVAILABLE;
        copyStatus.streamTextStatus = STATUS.AVAILABLE;
        copyStatus.playbackStatus = STATUS.AVAILABLE;
        copyStatus.webspeechStatus = STATUS.TRANSCRIBING;
    }

    // Dispatch to update Redux state
    dispatch({ type: "CHANGE_API_STATUS", payload: copyStatus });

    // Notify user of API switch
    // swal({
    //   title: "API Switched",
    //   text: `Switched to ${selectedApi}`,
    //   icon: "success",
    //   timer: 1500,
    // });

  }, [dispatch, selectedApi, serverAddress]); // Runs when the page loads

  
  // const { myTheme } = Theme()
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
