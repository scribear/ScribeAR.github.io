// /**
//  * The type of API that the recognizer is using
//  */
// export const enum API {
//    "WEBSPEECH",
//    "AZURE_TRANSLATION",
//    "AZURE_CONVERSATION",
//    "NONE",
// }

// /**
//  * Status for a particular API recognizer
//  */
// export const enum STATUS {
//    "AVAILABLE",
//    "NULL", // initialization or not implemented
//    "UNAVAILABLE",
//    "INPROGRESS",
//    "ERROR"
// }

/**
 * The type of API that the recognizer is using
 */
export const API = {
   WEBSPEECH: 0,
   AZURE_TRANSLATION: 1,
   AZURE_CONVERSATION: 2,
   NONE: 3,
} as const;
export type ApiType = typeof API[keyof typeof API];


/**
 * Status for a particular API recognizer
 */
export const STATUS = {
   AVAILABLE: 0,
   NULL: 1,
   UNAVAILABLE: 2,
   INPROGRESS: 3,
   ENDED: 4,
   ERROR: 5,
} as const;
export type StatusType = typeof STATUS[keyof typeof STATUS];