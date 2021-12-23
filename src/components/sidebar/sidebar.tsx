import * as React from 'react';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from "@mui/material/IconButton";
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import PhraseListAdd from './phrase/phraseListAdd'
import PhraseList from './phrase/phraseList'

import PhraseTextBox from './phrase/addPhrase'
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DetailsIcon from '@mui/icons-material/Details';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Listening from './STT/listening'
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import TextSize from './display/textSize'
import ThemeDropdown from './display/themeDropdown'
import MessageIcon from '@mui/icons-material/Message';
import SpeechLanguage from './STT/speechLanguage'
import TextLanguage from './STT/textLanguage'



/* todo:
      create listItem shell so that we can simply run a loop to render all of them
      this should help readability and also make adding ListItems in the future easier
*/
export default function STT(props) {
  const [state, setState] = React.useState({
    display: false,
    stt: true,
    visualization: false,
    phraseRecognition: false,
  });

  const toggleDrawer =
    (head: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setState({ ...state, [head]: !state[head] })
      }

  return (
    <div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <h3>Menu</h3>
      </div>
      <List
        sx={{ width: '20vw', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Speech To Text" />
          <IconButton onClick={toggleDrawer("stt")} >
            {state.stt ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.stt} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4, mb: 1}}>
              <ListItemText primary="Listening" />
              <Listening isRecording = {props.isRecording}/>
            </ListItem>
            <ListItem sx={{ pl: 4, mb: 1}}>
              <ListItemText primary="Speech Language" />
              <SpeechLanguage/>
            </ListItem>
            <ListItem sx={{ pl: 4, mb: 2 }}>
              <ListItemText primary="Text Language" />
              <TextLanguage/>
            </ListItem>
            

          </List>
        </Collapse>
        <Divider />
        
        <ListItem>
          <ListItemIcon>
            <DetailsIcon />
          </ListItemIcon>
          <ListItemText primary="Phrase Recognition" />
          <IconButton onClick={toggleDrawer("phraseRecognition")} >
            {state.phraseRecognition ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.phraseRecognition} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          <PhraseList/>
          <PhraseListAdd/>


            
          </List>
        </Collapse>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <ArchitectureIcon />
          </ListItemIcon>
          <ListItemText primary="Display"/>
          <IconButton onClick={toggleDrawer("display")} >
            {state.display ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.display} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4}}>
              <ListItemText primary="Textsize"/>
            </ListItem>
            <TextSize/>

            <ListItem sx={{ pl: 4, pt: 5}}>
              <ListItemText primary="Theme"/>
              <ThemeDropdown/>
            </ListItem>
          </List>
        </Collapse>
        <Divider />

        <ListItem>
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary="Audio Visualization" />
          <IconButton onClick={toggleDrawer("visualization")} >
            {state.visualization ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItem>
        <Collapse in={state.visualization} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Visualizing" />
              <Listening isRecording = {props.isRecording}/>

            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText primary="Design" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </List>
    </div>
  );
}