export type LanguageList = {
   label: string
   CountryCode: string
}

/**
 * Control interface represents function related aspects the user can change
 * @field listening: boolean dictating if the mic is on and outputting text
 */
export type ControlStatus = {
   listening: boolean
   speechLanguage: LanguageList
   textLanguage: LanguageList
   showFrequency: boolean
   showTimeData: boolean
   showMFCC: boolean
   showSpeaker: boolean
   showIntent: boolean
   // true when microphone is on but no audio chunks have been received for a short time
   micNoAudio?: boolean
}
