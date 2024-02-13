import React from 'react';
import { List, Collapse, GraphicEqIcon } from '../../../../muiImports';
import AudioUploader from './audioSubmit';

export default function PhraseMenu(props) {
  return (
    <div>
      {props.listItemHeader("Audio Testing", "audiotesting", GraphicEqIcon)}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <AudioUploader/>
        </List>
      </Collapse>
    </div>
  );
}