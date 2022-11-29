import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DisplayStatus, AzureStatus, ControlStatus, ApiStatus } from '../../react-redux&middleware/redux/typesImports';
import { RootState } from '../../store';

import sdk from 'microsoft-cognitiveservices-speech-sdk';


export class RecogHandler {

   /* =====-***-===== class variables =====-***-===== public by default =====-***-===== */
   // public static readonly SESSIONS : Map<string, Session> = new Map(); // a set of sessionIDs
   // public static readonly GLOBAL_IN_SESSION_USERS : Set<string> = new Set();


   public readonly recognizer : SpeechRecognition | sdk.TranslationRecognizer;
   public readonly isNewTranscript : boolean = true;
   public readonly fullTranscript : string = '';
   public readonly finalTranscript : string = '';
   public readonly notFinalTranscript : string = '';


   /* =====-***-===== class variables =====-***-===== public by default =====-***-===== */

   constructor(
      api : ApiStatus, 
      control : ControlStatus, 
      azure : AzureStatus,
      recognizer : SpeechRecognition | sdk.TranslationRecognizer,
   ) {
      this.recognizer = recognizer;
   }

   /* =====-***-===== =====-***-===== class methods =====-***-===== =====-***-===== */
   public startRecog = (api : ApiStatus, control : ControlStatus, azure : AzureStatus) => {


      

      

   }



   /* =====-***-===== class methods =====-***-===== public by default =====-***-===== */
}