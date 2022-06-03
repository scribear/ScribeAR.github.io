import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import PhraseListAdd from './phraseListAdd'
import DetailsIcon from '@mui/icons-material/Details';

export default function PhraseMenu(props) {

  return (
    <div>
      {props.listItemHeader("Phrase Recognition", "phraseRecognition", DetailsIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <PhraseListAdd />
        </List>
      </Collapse>
    </div>
  );
}