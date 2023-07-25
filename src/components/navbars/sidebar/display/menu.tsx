import React from 'react';

import { List, ListItemText, Collapse, ArchitectureIcon, ListItem } from '../../../../muiImports'
// import TextSize from './textSize'
import ThemeDropdown from './themeDropdown';
import FontColor from './fontColor';

export default function DisplayMenu(props) {

  return (
    <div>
      {props.listItemHeader("Display", "display", ArchitectureIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Font Color" />
            <FontColor />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Theme" />
            <ThemeDropdown />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}