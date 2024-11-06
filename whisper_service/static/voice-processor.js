class VoiceProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = (event) => {
            this.sampleRate = event.data.sampleRate;
        };

        this.buffer = [];
        this.bufferSize = 16384; //8192; //4096 16384
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const inputData = input[0];

            this.buffer.push(...inputData);

            if (this.buffer.length >= this.bufferSize) { // Example buffer size

                const inputData16 = this.downsampleBuffer(this.buffer, this.sampleRate, 16000);
                this.port.postMessage({ buffer: inputData16 });
                this.buffer = [];
            }

        }
        return true;
    }


    /**
     * We need this becouse of error on Firefox:
     * Error accessing media devices. DOMException: AudioContext.createMediaStreamSource: Connecting AudioNodes from AudioContexts with different sample-rate is currently not supported.
     * Default sampleRate for FF is 48000 but for Chrome is 16000
     * @param buffer
     * @param sampleRate
     * @param outSampleRate
     * @returns {ArrayBufferLike|*}
     */
    downsampleBuffer (buffer, sampleRate, outSampleRate) {
        if (outSampleRate == sampleRate) {
            return buffer;
        }
        if (outSampleRate > sampleRate) {
            throw 'downsampling rate show be smaller than original sample rate';
        }
        var sampleRateRatio = sampleRate / outSampleRate;
        var newLength = Math.round(buffer.length / sampleRateRatio);
        var result = new Int16Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            var accum = 0,
                count = 0;
            for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }

            result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result.buffer;
    }
}

registerProcessor('voice-processor', VoiceProcessor);
