import * as React from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import TextSize from './textSize'
import ThemeDropdown from './themeDropdown'

export default function DisplayMenu(props) {
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
        <ListItemText primary="Display" />
        <IconButton onClick={toggleDrawer("display")} >
          {state.open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={state.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Textsize" />
          </ListItem>
          <TextSize />
          <ListItem sx={{ pl: 4, pt: 5 }}>
            <ListItemText primary="Theme" />
            <ThemeDropdown />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}