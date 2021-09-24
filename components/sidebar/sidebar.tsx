import * as React from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MicIcon from '@mui/icons-material/Mic';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Listening from './STT/listening'
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import TextSize from './display/textSize'

export default function STT(props) {
  const [state, setState] = React.useState({
    display: true,
    stt: true,
    visualization: true,
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
        <ListItem>
          <ListItemIcon>
            <MicIcon />
          </ListItemIcon>
          <ListItemText primary="Speech To Text" />
          <IconButton onClick={toggleDrawer("stt")} >
            {state.stt ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.stt} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Listening" />
              <Listening />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="API" />
              <h3>Webspeech</h3>
            </ListItem>
          </List>
        </Collapse>
        <Divider />

        <ListItem>
          <ListItemIcon>
            <ArchitectureIcon />
          </ListItemIcon>
          <ListItemText primary="Display" />
          <IconButton onClick={toggleDrawer("display")} >
            {state.display ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.display} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Textsize" />
              <TextSize item="Text Size" color={props.color}
            text={props.text}
            setText={props.setText} />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Theme" />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Layout" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />

        <ListItem>
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary="Audio Visualization" />
          <IconButton onClick={toggleDrawer("visualization")} >
            {state.visualization ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.visualization} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Off" />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Design" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </List>
    </div>
  );
}