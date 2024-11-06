import React from 'react';

import { List, Collapse, DetailsIcon } from '../../../../muiImports'
import PhraseListAdd from './phraseListAdd'

export default function PhraseMenu(props) {

  return (
    <div>
      {props.listItemHeader("Phrase Recognition", "phraseRecognition", DetailsIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <PhraseListAdd/>
        </List>
      </Collapse>
    </div>
  );
}