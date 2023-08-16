/**
 * The type of API that the recognizer is using
 */
export const API = {
   WEBSPEECH: 0,
   AZURE_TRANSLATION: 1,
   AZURE_CONVERSATION: 2,
   NONE: 3,
   WHISPER: 4,
} as const;
export type ApiType = typeof API[keyof typeof API];


/**
 * Status for a particular API recognizer
 */
// TODO: Reconfigure it
export const STATUS = {
   AVAILABLE: 0,
   NULL: 1,
   UNAVAILABLE: 2,
   TRANSCRIBING: 3,
   ENDED: 4,
   ERROR: 5,
} as const;
export type StatusType = typeof STATUS[keyof typeof STATUS];