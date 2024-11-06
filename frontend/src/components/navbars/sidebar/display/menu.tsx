import React from 'react';

import { List, ListItemText, Collapse, ArchitectureIcon, ListItem } from '../../../../muiImports'
// import TextSize from './textSize'
import ThemeDropdown from './themeDropdown';
import FontColor from './fontColor';
import BackgroundColor from './backgroundColor';
import AccentColor from './accentColor';

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
            <ListItemText primary="Background Color" />
            <BackgroundColor />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Accent Color" />
            <AccentColor />
          </ListItem>
          <ListItem sx={{ pl: 4 }}>
            <ListItemText primary="Preset Themes" />
            <ThemeDropdown />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}