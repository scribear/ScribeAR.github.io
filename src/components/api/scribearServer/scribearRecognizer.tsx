import { Recognizer } from "../recognizer";
import { TranscriptBlock } from "../../../react-redux&middleware/redux/types/TranscriptTypes";
import { ScribearServerStatus } from "../../../react-redux&middleware/redux/typesImports";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { store } from "../../../store";
import {
  setModelOptions,
  setSelectedModel,
} from "../../../react-redux&middleware/redux/reducers/modelSelectionReducers";
import type { SelectedOption } from "../../../react-redux&middleware/redux/types/modelSelection";
import TranscriptionStreamClient from "./transcription_stream_client/transcription_stream_client";

enum BackendTranscriptBlockType {
  Final = 0,
  InProgress = 1,
}

type BackendTranscriptBlock = {
  type: BackendTranscriptBlockType;
  start: number;
  end: number;
  text: string;
};

export class ScribearRecognizer implements Recognizer {
  private scribearServerStatus: ScribearServerStatus;
  private selectedModelOption: SelectedOption;
  private socket: WebSocket | null = null;
  private ready = false;
  private transcribedCallback: any;
  private errorCallback?: (e: Error) => void;
  private language: string;
  private recorder?: RecordRTC;
  private kSampleRate = 16000;

  private transcriptionStreamClient: TranscriptionStreamClient;

  urlParams = new URLSearchParams(window.location.search);
  mode = this.urlParams.get("mode");

  /**
   * Creates an Azure recognizer instance that listens to the default microphone
   * and expects speech in the given language
   * @param audioSource Not implemented yet
   * @param language Expected language of the speech to be transcribed
   */
  constructor(
    scribearServerStatus: ScribearServerStatus,
    selectedModelOption: SelectedOption,
    language: string
  ) {
    console.log("ScribearRecognizer, new recognizer being created!");

    this.language = language;
    this.selectedModelOption = selectedModelOption;
    this.scribearServerStatus = scribearServerStatus;
    this.transcriptionStreamClient = new TranscriptionStreamClient(
      scribearServerStatus.scribearServerAddress,
      scribearServerStatus.scribearServerKey,
      false,
      "whisper",
      {
        sample_rate: this.kSampleRate,
        num_channels: 1,
      }
    );
  }

  private async _startRecording() {
    let mic_stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.recorder = new RecordRTC(mic_stream, {
      type: "audio",
      mimeType: "audio/wav",
      desiredSampRate: this.kSampleRate,
      timeSlice: 50,
      ondataavailable: async (blob: Blob) => {
        this.transcriptionStreamClient.send_audio(blob);
      },
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
    });

    this.recorder.startRecording();
  }

  /**
   * Makes the Azure recognizer start transcribing speech asynchronously, if it has not started already
   * Throws exception if recognizer fails to start
   */
  start() {
    this.transcriptionStreamClient.on("connected", () => {
      this._startRecording();
    });

    this.transcriptionStreamClient.on(
      "ip_transcription",
      (text, starts, ends) => {
        const block = new TranscriptBlock();
        block.text = text.join("");
        this.transcribedCallback([], block);
      }
    );
    this.transcriptionStreamClient.on(
      "final_transcription",
      (text, starts, ends) => {
        const block = new TranscriptBlock();
        block.text = text.join("");
        this.transcribedCallback([block], new TranscriptBlock());
      }
    );

    this.transcriptionStreamClient.connect();
  }

  /**
   * Makes the Azure recognizer stop transcribing speech asynchronously
   * Throws exception if recognizer fails to stop
   */
  stop() {
    this.transcriptionStreamClient.disconnect();

    if (this.recorder) {
      this.recorder.stopRecording();
    }
  }

  /**
   * Subscribe a callback function to the transcript update event, which is usually triggered
   * when the recognizer has processed more speech or some transcript has been finalized
   * @param callback A callback function called with the updates to the transcript
   */
  onTranscribed(
    callback: (
      newFinalBlocks: Array<TranscriptBlock>,
      newInProgressBlock: TranscriptBlock
    ) => void
  ) {
    console.log("ScribearRecognizer.onTranscribed()");
    // "recognizing" event signals that the in-progress block has been updated
    this.transcribedCallback = callback;
  }

  /**
   * Subscribe a callback function to the error event, which is triggered
   * when the recognizer has encountered an error that it cannot handle
   * @param callback A callback function called with the error object when the event is triggered
   */
  onError(callback: (e: Error) => void) {
    console.log("ScribearRecognizer.onError()");
    this.errorCallback = callback;
  }
}
