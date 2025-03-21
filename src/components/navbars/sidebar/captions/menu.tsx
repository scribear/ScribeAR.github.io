import React from 'react';

import { List, ListItemText, Collapse, ListItem, SubtitlesIcon } from '../../../../muiImports';
import Position from './position';
import DisplayRows from './displayRows';
import TextSize from './textSize';
import WordSpacing from './wordSpacing';
import LineHeight from './lineHeight';


export default function CaptionsMenu(props) {

   return (
      <div>
         {props.listItemHeader("Captions", "captions", SubtitlesIcon)}

         <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Text Size" />
               </ListItem>
               <TextSize />
               <ListItem sx={{ pl: 4, pt: 5 }}>
                  <ListItemText primary="Number of Display Rows" />
               </ListItem>
               <DisplayRows />
               <ListItem sx={{ pl: 4, pt: 5  }}>
                  <ListItemText primary="Position" />
               </ListItem>
               <Position />
               <ListItem sx={{ pl: 4, pt: 5  }}>
                  <ListItemText primary="Word Spacing" />
               </ListItem>
               <WordSpacing />
               <ListItem sx={{ pl: 4, pt: 5  }}>
                  <ListItemText primary="Line Height" />
               </ListItem>
               <LineHeight />
            </List>
         </Collapse>
      </div>
   );
}