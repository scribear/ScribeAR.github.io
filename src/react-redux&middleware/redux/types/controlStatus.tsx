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
   showQRCode: boolean;
   showTimeData: boolean
   showMFCC: boolean
   showSpeaker: boolean
   showIntent: boolean
}
