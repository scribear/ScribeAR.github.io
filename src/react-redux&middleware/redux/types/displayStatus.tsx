
/**
 * Relating to visual aspects of the website the user can change
 * @field textSize: textSize of text from speech to text (i couldnt think of a way to say this without saying text 3 times)
 * @field color: theme of website
 */
export type DisplayStatus = {
   textSize: number
   primaryColor: string // background
   secondaryColor: string // header, sidebar
   textColor: string
   menuVisible: boolean
}