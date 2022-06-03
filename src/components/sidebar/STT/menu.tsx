import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Listening from './listening'
import MessageIcon from '@mui/icons-material/Message';
import ListItem from '@mui/material/ListItem';
import SpeechLanguage from './speechLanguage'
import TextLanguage from './textLanguage'


export default function STTMenu(props) {


  return (
    <div>
      {props.listItemHeader("Speech To Text", "stt", MessageIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary="Listening" />
            <Listening isRecording={props.isRecording} />
          </ListItem>
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary="Speech Language" />
            <SpeechLanguage />
          </ListItem>
          <ListItem sx={{ pl: 4, mb: 2 }}>
            <ListItemText primary="Text Language" />
            <TextLanguage />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}