import * as React from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Listening from './listening'
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import SpeechLanguage from './speechLanguage'
import TextLanguage from './textLanguage'


export default function STTMenu(props) {
  const [state, setState] = React.useState({
    open: true,
  });
  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, open: !state.open })
      }
  return (
    <div>
      <ListItem>
        <ListItemIcon>
          <props.icon />
        </ListItemIcon>
        <ListItemText primary="Speech To Text" />
        <IconButton onClick={toggleDrawer("stt")} >
          {state.open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={state.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary="Listening" />
            <Listening isRecording={props.isRecording} />
          </ListItem>
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary="Speech Language" />
            <SpeechLanguage />
          </ListItem>
          <ListItem sx={{ pl: 4, mb: 2 }}>
            <ListItemText primary="Text Language" />
            <TextLanguage />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}