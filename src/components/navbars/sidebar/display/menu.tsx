import React from 'react';

import { List, ListItemText, Collapse, ArchitectureIcon, ListItem } from '../../../../muiImports'
import TextSize from './textSize'
import ThemeDropdown from './themeDropdown'

export default function DisplayMenu(props) {

  return (
    <div>
      {props.listItemHeader("Display", "display", ArchitectureIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
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