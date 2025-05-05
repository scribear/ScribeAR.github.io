import React from 'react';

import { List, ListItemText, Collapse, ListItem, EqualizerIcon } from '../../../../muiImports';
import ShowFrequency from './showFrequency';
import ShowTimeData from './showTimeData';
import ShowMFCC from './showMFCC';
import ShowSpeaker from './showSpeaker';
import ShowIntent from './showIntent';
import ShowQRCode from './showQRCode';

const urlParams = new URLSearchParams(window.location.search);

const isKioskMode = urlParams.get('mode') === 'kiosk';
const isStudentMode = urlParams.get('mode') === 'student';


export default function VisualizationMenu(props) {

   return (
      <div>
         {props.listItemHeader("Visualization", "visualization", EqualizerIcon)}

         <Collapse in={props.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Frequency" />
                  <ShowFrequency />
               </ListItem>
               {/* <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Labels" />
                  <ShowLabels />
               </ListItem> */}
               {isKioskMode && !isStudentMode && (
                  <ListItem sx={{ pl: 4 }}>
                     <ListItemText primary="Show QR Code" />
                     <ShowQRCode />
                  </ListItem>
               )}
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Time Data" />
                  <ShowTimeData />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show MFCC" />
                  <ShowMFCC />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Speaker" />
                  <ShowSpeaker />
               </ListItem>
               <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Show Intent" />
                  <ShowIntent />
               </ListItem>
            </List>
         </Collapse>
      </div>
   );
}