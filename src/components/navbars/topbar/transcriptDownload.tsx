import { FileDownloadIcon, ThemeProvider, IconButton, Tooltip  } from '../../../muiImports';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ControlStatus, Transcript } from '../../../react-redux&middleware/redux/typesImports';
import Theme from '../../theme'
import * as React from 'react';

export default function TranscriptDownload() {
  const dispatch = useDispatch();
  
  let controlStatus = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });

  let transcriptStatus = useSelector((state: RootState) => {
    return state.TranscriptReducer as Transcript;
  });


  const handleClick = (event: React.MouseEvent) => {
    let text = transcriptStatus.previousTranscript[0] + transcriptStatus.currentTranscript[0];
    console.log("transcript download", text);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'textfile.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  const {myTheme} = Theme()

  return (
    <div>
      <IconButton className = "c2" color = "inherit" onClick = {handleClick}>
        <FileDownloadIcon fontSize="large"/>
      </IconButton>
    </div>
  );
}
