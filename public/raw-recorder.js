/**
 * Audio Worklet that captures raw PCM audio from an input node
 * And passes it as a typed array to the main thread
 */
class RawRecorder extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
      // TODO: handle multi-channel input for diarization and stuff?
      // Float32Array containing 128 samples from the first channel of the first input node
      const audio = inputs[0][0];
      // Transfer the underlying ArrayBuffer to main thread for speed, see
      // "Transferrable Objects"
      this.port.postMessage(audio.buffer, [audio.buffer]);
      return true;
  }
}
  
registerProcessor("raw-recorder", RawRecorder);