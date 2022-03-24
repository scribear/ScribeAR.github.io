import * as React from 'react';
import List from '@mui/material/List';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DetailsIcon from '@mui/icons-material/Details';
import Divider from '@mui/material/Divider';
import MessageIcon from '@mui/icons-material/Message';
import DisplayMenu from './display/displayMenu';
import STTMenu from './STT/STTMenu';
import PhraseMenu from './phrase/phraseMenu';
import VisualizationMenu from './visualization/visualizationMenu';

export default function STT(props) {
  const [state, setState] = React.useState({
    display: false,
    stt: true,
    visualization: false,
    phraseRecognition: false,
  });

  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, [head]: !state[head] })
      }
  return (
    <div>
      <h3>Menu</h3>
      <List
        sx={{ width: '20vw', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <STTMenu
          icon={MessageIcon}
          isRecording={props.isRecording}
        />
        <Divider />
        <DisplayMenu
          icon={ArchitectureIcon}
        />
        <Divider />
        <PhraseMenu
          icon={DetailsIcon}
        />
        <Divider />
        <VisualizationMenu
          icon={EqualizerIcon}
        />
        <Divider />

      </List>
    </div>
  );
}


