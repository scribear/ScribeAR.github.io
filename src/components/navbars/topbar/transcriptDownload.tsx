import { FileDownloadIcon, IconButton, Tooltip  } from '../../../muiImports';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
//import { ControlStatus } from '../../../react-redux&middleware/redux/typesImports';
//import Theme from '../../theme'
import * as React from 'react';
import { MultiSpeakerTranscript } from '../../../react-redux&middleware/redux/types/TranscriptTypes';

export default function TranscriptDownload() {
  // const dispatch = useDispatch();
  
  // let controlStatus = useSelector((state: RootState) => {
  //   return state.ControlReducer as ControlStatus;
  // });

  let transcriptStatus = useSelector((state: RootState) => {
    return state.TranscriptReducer as MultiSpeakerTranscript;
  });


  const handleClick = (event: React.MouseEvent) => {
    let text = transcriptStatus.transcripts[0].toString();
    console.log("transcript download", text);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'textfile.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  //const {myTheme} = Theme()

  return (
    <div>
      <Tooltip title="Download Transcript">
        <IconButton className = "c2" color = "inherit" onClick = {handleClick}>
          <FileDownloadIcon fontSize="large"/>
        </IconButton>
      </Tooltip>
    </div>
  );
}
