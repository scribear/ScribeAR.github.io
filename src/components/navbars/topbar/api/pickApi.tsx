import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  API,
  ApiStatus,
  ApiType,
  AzureStatus,
  ControlStatus,
  RootState,
  STATUS,
  StreamTextStatus,
  ScribearServerStatus,
  PlaybackStatus,
} from '../../../../react-redux&middleware/redux/typesImports';

import {
  CancelIcon,
  CheckCircleIcon,
  DoNotDisturbOnIcon,
  ErrorIcon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  Chip,
} from '../../../../muiImports';
import { ListItem } from '@mui/material';

import AzureSettings from './AzureSettings';
import StreamTextSettings from './StreamTextSettings';
import ScribearServerSettings from './ScribearServerSettings';
import PlaybackSettings from './PlaybackSettings';
import WhisperSettings from './WhisperSettings';

import swal from 'sweetalert';
import { testAzureTranslRecog } from '../../../api/azure/azureTranslRecog';
import { selectSelectedModel } from '../../../../react-redux&middleware/redux/reducers/modelSelectionReducers';

// helper to normalize selected model to 'tiny' | 'base' | undefined
function getSelectedModelKey(selected: unknown): 'tiny' | 'base' | undefined {
  if (typeof selected === 'string') {
    return selected === 'tiny' || selected === 'base' ? selected : undefined;
  }
  if (selected && typeof selected === 'object' && 'key' in (selected as any)) {
    const k = (selected as any).key;
    return k === 'tiny' || k === 'base' ? k : undefined;
  }
  return undefined;
}

const currTheme = createTheme({
  palette: {
    primary: { main: '#ffffff' },
    success: { main: '#4caf50' },
    warning: { main: '#f44336' },
    error:   { main: '#C8C224' },
  },
});

/** Status icon shown on the left of each API row */
const IconStatus = (currentApi: any) => {
  const myTheme = currTheme;
  switch (currentApi.currentApi) {
    case STATUS.AVAILABLE:
      return (
        <ThemeProvider theme={myTheme}>
          <DoNotDisturbOnIcon />
        </ThemeProvider>
      );
    case STATUS.TRANSCRIBING:
      return (
        <ThemeProvider theme={myTheme}>
          <CheckCircleIcon color="success" />
        </ThemeProvider>
      );
    case STATUS.UNAVAILABLE:
      return (
        <ThemeProvider theme={myTheme}>
          <CancelIcon color="warning" />
        </ThemeProvider>
      );
    default:
      return (
        <ThemeProvider theme={myTheme}>
          <ErrorIcon color="error" />
        </ThemeProvider>
      );
  }
};

export default function PickApi() {
  const dispatch = useDispatch();
  const myTheme = currTheme;

  // ✅ hooks INSIDE the component
  const apiStatus = useSelector((state: RootState) => state.APIStatusReducer as ApiStatus);
  const controlStatus = useSelector((state: RootState) => state.ControlReducer as ControlStatus);
  const azureStatus = useSelector((state: RootState) => state.AzureReducer as AzureStatus);
  const streamTextStatus = useSelector((state: RootState) => state.StreamTextReducer as StreamTextStatus);
  const scribearServerStatus = useSelector((state: RootState) => state.ScribearServerReducer as ScribearServerStatus);
  const playbackStatus = useSelector((state: RootState) => state.PlaybackReducer as PlaybackStatus);

  const selectedModel = useSelector(selectSelectedModel as any);
  const selectedModelKey = React.useMemo(
    () => getSelectedModelKey(selectedModel),
    [selectedModel]
  );

  const [state, setState] = React.useState({
    showAzureDropdown: false,
    showWhisperDropdown: false,
  });

  const switchToAzure = async () => {
    dispatch({ type: 'FLIP_RECORDING', payload: controlStatus });
    const copyStatus = { ...apiStatus };
    testAzureTranslRecog(controlStatus, azureStatus)
      .then(() => {
        localStorage.setItem('azureStatus', JSON.stringify(azureStatus));
        copyStatus.currentApi = API.AZURE_TRANSLATION;
        copyStatus.azureTranslStatus = STATUS.TRANSCRIBING;
        copyStatus.webspeechStatus = STATUS.AVAILABLE;
        copyStatus.azureConvoStatus = STATUS.AVAILABLE;
        copyStatus.whisperStatus = STATUS.AVAILABLE;
        copyStatus.streamTextStatus = STATUS.AVAILABLE;
        copyStatus.playbackStatus = STATUS.AVAILABLE;
        swal({ title: 'Success!', text: 'Switching to Microsoft Azure', icon: 'success', timer: 1500 });
        dispatch({ type: 'CHANGE_API_STATUS', payload: copyStatus });
      })
      .catch((error) => {
        copyStatus.azureTranslStatus = STATUS.ERROR;
        swal({ title: 'Warning!', text: `${error}`, icon: 'warning' });
      })
      .finally(() => {
        dispatch({ type: 'FLIP_RECORDING', payload: controlStatus });
      });
  };

  const toggleDrawer =
    (apiStat: string, api: ApiType, isArrow: boolean) =>
    (_event: React.KeyboardEvent | React.MouseEvent) => {
      if (apiStatus.currentApi !== api) {
        if (!isArrow) {
          const copyStatus = { ...apiStatus, currentApi: api };

          // reset all
          copyStatus.azureTranslStatus = STATUS.AVAILABLE;
          copyStatus.webspeechStatus = STATUS.AVAILABLE;
          copyStatus.azureConvoStatus = STATUS.AVAILABLE;
          copyStatus.whisperStatus = STATUS.AVAILABLE;
          copyStatus.streamTextStatus = STATUS.AVAILABLE;
          copyStatus.scribearServerStatus = STATUS.AVAILABLE;
          copyStatus.playbackStatus = STATUS.AVAILABLE;

          let apiName = '';
          if (api === API.AZURE_TRANSLATION) {
            apiName = 'Microsoft Azure'; copyStatus.azureTranslStatus = STATUS.TRANSCRIBING;
          } else if (api === API.WHISPER) {
            apiName = 'Whisper';         copyStatus.whisperStatus = STATUS.TRANSCRIBING;
          } else if (api === API.WEBSPEECH) {
                                         copyStatus.webspeechStatus = STATUS.TRANSCRIBING;
          } else if (api === API.STREAM_TEXT) {
            apiName = 'StreamText';      copyStatus.streamTextStatus = STATUS.TRANSCRIBING;
          } else if (api === API.SCRIBEAR_SERVER) {
            apiName = 'ScribeAR Server'; copyStatus.scribearServerStatus = STATUS.TRANSCRIBING;
          } else if (api === API.PLAYBACK) {
            apiName = 'Playback';        copyStatus.playbackStatus = STATUS.TRANSCRIBING;
          }

          dispatch({ type: 'CHANGE_API_STATUS', payload: copyStatus });
          swal({ title: 'Success!', text: 'Switching to ' + apiName, icon: 'success', timer: 2500 });
        } else {
          setState((s) => ({ ...s, [apiStat]: !s[apiStat] }));
        }
      } else if (isArrow) {
        setState((s) => ({ ...s, [apiStat]: !s[apiStat] }));
      }
    };

  const switchToStreamText = (e: React.KeyboardEvent | React.MouseEvent) => {
    localStorage.setItem('streamTextStatus', JSON.stringify(streamTextStatus));
    return toggleDrawer('streamTextStatus', API.STREAM_TEXT, false)(e);
  };

  const switchToScribearServer = (e: React.KeyboardEvent | React.MouseEvent) => {
    localStorage.setItem('scribearServerStatus', JSON.stringify(scribearServerStatus));
    return toggleDrawer('scribearServerStatus', API.SCRIBEAR_SERVER, false)(e);
  };

  const switchToPlayback = (e: React.KeyboardEvent | React.MouseEvent) => {
    localStorage.setItem('playbackStatus', JSON.stringify(playbackStatus));
    return toggleDrawer('playbackStatus', API.PLAYBACK, false)(e);
  };

  return (
    <div>
      {/* Webspeech */}
      <ListItem disableGutters>
        <ListItemButton onClick={toggleDrawer('webspeechStatus', API.WEBSPEECH, false)}>
          <ThemeProvider theme={myTheme}>
            <ListItemIcon>
              <IconStatus {...{ currentApi: apiStatus.webspeechStatus }} />
            </ListItemIcon>
          </ThemeProvider>
          <ListItemText primary="Webspeech" />
        </ListItemButton>
      </ListItem>

      {/* Microsoft Azure */}
      <ListItem>
        <ListItemButton disableGutters onClick={switchToAzure}>
          <ListItemIcon>
            <IconStatus {...{ currentApi: apiStatus.azureTranslStatus }} />
          </ListItemIcon>
          <ListItemText primary="Microsoft Azure" />
        </ListItemButton>
        <AzureSettings />
      </ListItem>

      {/* ScribeAR Server */}
      <ListItem>
        <ListItemButton disableGutters onClick={switchToScribearServer}>
          <ListItemIcon>
            <IconStatus {...{ currentApi: apiStatus.scribearServerStatus }} />
          </ListItemIcon>
          <ListItemText primary="ScribeAR Server" />
        </ListItemButton>
        <ScribearServerSettings />
      </ListItem>

      {/* Playback */}
      <ListItem>
        <ListItemButton disableGutters onClick={switchToPlayback}>
          <ListItemIcon>
            <IconStatus {...{ currentApi: apiStatus.playbackStatus }} />
          </ListItemIcon>
          <ListItemText primary="Playback" />
        </ListItemButton>
        <PlaybackSettings />
      </ListItem>

      {/* StreamText */}
      <ListItem>
        <ListItemButton disableGutters onClick={switchToStreamText}>
          <ListItemIcon>
            <IconStatus {...{ currentApi: apiStatus.streamTextStatus }} />
          </ListItemIcon>
          <ListItemText primary="StreamText" />
        </ListItemButton>
        <StreamTextSettings />
      </ListItem>

      {/* Whisper (button + gear; inline chip shows selected model) */}
      <ListItem>
        <ListItemButton
          disableGutters
          onClick={toggleDrawer('whisperStatus', API.WHISPER, false)}
        >
          <ListItemIcon>
            <IconStatus {...{ currentApi: apiStatus.whisperStatus }} />
          </ListItemIcon>

          <ListItemText
            primary={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>Whisper</span>
                {selectedModelKey && (
                  <Chip size="small" variant="outlined" label={selectedModelKey.toUpperCase()} />
                )}
              </span>
            }
          />
        </ListItemButton>
        <WhisperSettings />
      </ListItem>
    </div>
  );
}
