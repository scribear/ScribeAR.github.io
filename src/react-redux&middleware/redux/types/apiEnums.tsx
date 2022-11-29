/**
 * The type of API that the recognizer is using
 */
export const enum API {
   "WEBSPEECH",
   "AZURE_TRANSLATION",
   "AZURE_CONVERSATION",
   "NONE",
}

/**
 * Status for a particular API recognizer
 */
export const enum STATUS {
   "AVAILABLE",
   "NULL", // initialization or not implemented
   "UNAVAILABLE",
   "INPROGRESS",
   "ERROR"
}

