import * as React from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PhraseListAdd from './phraseListAdd'
import PhraseList from './phraseList'
import ListItem from '@mui/material/ListItem';

export default function PhraseMenu(props) {
  const [state, setState] = React.useState({
    open: false,
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
        <ListItemText primary="Phrase Recognition" />
        <IconButton onClick={toggleDrawer("phraseRecognition")} >
          {state.open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={state.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <PhraseListAdd />

        </List>
      </Collapse>
    </div>
  );
}