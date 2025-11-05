import React, { useEffect, useState } from 'react';

import Desktop from './mode/Desktop';
import WhisperFrame from './mode/WhisperFrame';
import { useSelector } from 'react-redux';
import { RootState, DisplayStatus, STATUS } from './react-redux&middleware/redux/typesImports';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './App.css';

function App() {
  const display = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
  });

  const scribearStatus = useSelector((state: RootState) => state.APIStatusReducer?.scribearServerStatus as number);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('info');

  useEffect(() => {
    // Show a visible snackbar when ScribeAR server experiences error or disconnects
    if (scribearStatus === STATUS.ERROR) {
      setSnackbarMsg('ScribeAR Server error: connection problem');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else if (scribearStatus === STATUS.UNAVAILABLE) {
      setSnackbarMsg('ScribeAR Server disconnected');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } else if (scribearStatus === STATUS.AVAILABLE || scribearStatus === STATUS.TRANSCRIBING) {
      // Optionally notify successful connection briefly
      setSnackbarMsg('ScribeAR Server connected');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // auto-close success after short time handled by Snackbar props
    }
    // else if (scribearStatus === STATUS.TRANSCRIBING) {
    //   // keep transcribing as info; close any earlier error
    //   setSnackbarMsg('ScribeAR Server connected');
    //   setSnackbarSeverity('success');
    //   setSnackbarOpen(true);
    // }
  }, [scribearStatus]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <div className="App" style={{ color: display.primaryColor, background: display.primaryColor }}>
      <header className="App-header" style={{ color: display.primaryColor, background: display.primaryColor, minWidth: '360px', height: '100vh', minHeight: '900px' }}>
        <Desktop />
        <WhisperFrame />
      </header>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
