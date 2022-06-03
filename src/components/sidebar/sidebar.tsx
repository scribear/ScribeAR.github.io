import * as React from 'react';
import List from '@mui/material/List';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DetailsIcon from '@mui/icons-material/Details';
import Divider from '@mui/material/Divider';
import DisplayMenu from './display/menu';
import STTMenu from './STT/menu';
import PhraseMenu from './phrase/menu';
import VisualizationMenu from './audioVisBar/menu';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';


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
  
  const listItemHeader = (subMenu: string, drawerName: string, Icon) => {
    console.log(state)
    return (
    <ListItem>
        <ListItemIcon>
          <Icon/>
        </ListItemIcon>
        <ListItemText primary= {subMenu} />
        <IconButton onClick={toggleDrawer(drawerName)} >
          {state[drawerName] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
    )
  }


  return (
    <div>
    <h2 className="d-table-cell tar2" style={{textAlign: "left", paddingLeft: "20px"}}>Menu</h2>
      <List
        sx={{ width: '20vw', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <STTMenu
          open={state.stt}
          isRecording={props.isRecording}
          listItemHeader={listItemHeader}
        />
        <Divider/>
        <DisplayMenu
          open={state.display}
          listItemHeader={listItemHeader}
        />
        <Divider/>
        <PhraseMenu
          open={state.phraseRecognition}
          icon={DetailsIcon}
          listItemHeader={listItemHeader}
        />
        <Divider/>
          <VisualizationMenu
            open={state.visualization}
            icon={EqualizerIcon}
            listItemHeader={listItemHeader}
          />
        <Divider/>

      </List>
    </div>
  );
}


