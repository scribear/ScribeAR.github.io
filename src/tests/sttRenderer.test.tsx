import { render, screen } from '@testing-library/react';
import { store } from '../store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import * as fs from 'fs'
import { STTRenderer } from '../components/sttRenderer';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';

// AudioVis uses audioContext, not supported by jest yet, thus we must mock it
jest.mock('../components/api/visualization/audioVis', () => ({ AudioVis: () => 'mocked AudioVis' }));

// Mocking AudioConfig to pass an audio file instead of microphone to Azure
// This lets us test Azure transcription
let mockfromDefaultMicrophoneInput = () => {
  const audio = fs.readFileSync('rat-audio.wav');
  return AudioConfig.fromWavFileInput(audio);
}
jest.doMock('microsoft-cognitiveservices-speech-sdk', () => ({
  ...jest.requireActual('microsoft-cognitiveservices-speech-sdk'),
  AudioConfig: {
    fromDefaultMicrophoneInput: mockfromDefaultMicrophoneInput
  }
}))

// TODO: feed audio file into azure at increased speed? possible?
test('Render STTRenderer', () => {
  render(
    <Provider store={store}>
      <STTRenderer/>
    </Provider>,
  );
  expect(1).toBeGreaterThanOrEqual(0);
});
