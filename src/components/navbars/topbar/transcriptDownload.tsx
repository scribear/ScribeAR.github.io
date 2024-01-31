import {
  FileDownloadIcon,
  ThemeProvider,
  IconButton,
  Tooltip,
} from "../../../muiImports";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  ControlStatus,
  Transcript,
} from "../../../react-redux&middleware/redux/typesImports";
import Theme from "../../theme";
import * as React from "react";

export default function TranscriptDownload() {
  const dispatch = useDispatch();

  let controlStatus = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });

  let transcriptStatus = useSelector((state: RootState) => {
    return state.TranscriptReducer as Transcript;
  });

  const handleClick = (event: React.MouseEvent) => {
    let text =
      transcriptStatus.previousTranscript[0] +
      transcriptStatus.currentTranscript[0];
    console.log("transcript download", text);
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "textfile.txt";
    link.click();
    window.URL.revokeObjectURL(url);

    let transcript = transcriptStatus.previousTranscript.concat(
      transcriptStatus.currentTranscript
    );
    let webVttText = "WEBVTT\n\n";
    let currentTime = 0;

    transcript.forEach((sentence) => {
      sentence.split(" ").forEach((word) => {
        const wordDuration = 1;
        const endTime = currentTime + wordDuration;

        webVttText += `${formatTime(currentTime)} --> ${formatTime(
          endTime
        )}\n${word}\n\n`;

        currentTime = endTime;
      });
    });

    const webVttBlob = new Blob([webVttText], { type: "text/vtt" });
    const webVttUrl = window.URL.createObjectURL(webVttBlob);
    const webVttLink = document.createElement("a");
    webVttLink.href = webVttUrl;
    webVttLink.download = "transcript.vtt";
    webVttLink.click();
    window.URL.revokeObjectURL(webVttUrl);
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.round((time % 1) * 1000);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(
      milliseconds
    )}`;
  };

  const padZero = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  const { myTheme } = Theme();

  return (
    <div>
      <IconButton className="c2" color="inherit" onClick={handleClick}>
        <FileDownloadIcon fontSize="large" />
      </IconButton>
    </div>
  );
}
