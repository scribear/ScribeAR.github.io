import React from 'react';

import { List, ListItemText, Collapse, ListItem, SubtitlesIcon } from '../../../../muiImports';
import Position from './position';
import LineNumbers from './lineNumbers'


export default function CaptionsMenu(props) {

   return (
      <div>
         {props.listItemHeader("Captions", "captions", SubtitlesIcon)}

         <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Line Numbers" />
               </ListItem>
               <LineNumbers />
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Position" />
               </ListItem>
               <Position />
            </List>
         </Collapse>
      </div>
   );
}