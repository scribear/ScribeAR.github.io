import React from 'react';

import { List, ListItemText, Collapse, ListItem, SubtitlesIcon } from '../../../../muiImports';
import Position from './position';
import DisplayRows from './displayRows'


export default function CaptionsMenu(props) {

   return (
      <div>
         {props.listItemHeader("Captions", "captions", SubtitlesIcon)}

         <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Number of Display Rows" />
               </ListItem>
               <DisplayRows />
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Position" />
               </ListItem>
               <Position />
            </List>
         </Collapse>
      </div>
   );
}