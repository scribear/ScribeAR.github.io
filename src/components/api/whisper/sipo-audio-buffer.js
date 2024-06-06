/**
 * Fixed sized serial-in-parallel-out buffer to store chunks of 32-bit linear PCM audio 
 * normalized to the [-1, 1] range.
 */
export class SIPOAudioBuffer {
    constructor(num_chunks, chunk_length) {
        this.chunk_length = chunk_length;
        this.array = new Float32Array(num_chunks * this.chunk_length);
        this.offset = 0;
    }
    /**
     * Push one fixed length chunk into the buffer.
     * @param data The Float32Array audio chunk to be pushed into the buffer
     */
    push(data) {
        this.array.set(data, this.offset);
        this.offset += this.chunk_length;
    }
    /**
     * Return the content of the whole buffer in chronological order
     * @returns A Float32Array containing the content of the buffer
     */
    getAll() {
        // We do not have worry about race condition with push() here, since JS is single-threaded
        return this.array.slice(0, this.offset);
    }
    /**
     * Determines if the buffer is full
     * @returns True if the buffer is full, false else
     */
    isFull() {
        return this.offset == this.array.length;
    }
    /**
     * Erase all entries from the buffer
     */
    clear() {
        this.offset = 0;
    }
}