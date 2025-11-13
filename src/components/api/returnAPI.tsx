// src/components/api/returnAPI.tsx

// import * * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import installCOIServiceWorker from './coi-serviceworker'
import { API, PlaybackStatus } from '../../react-redux&middleware/redux/typesImports';
import {
  ApiStatus, AzureStatus, ControlStatus, SRecognition,
  StreamTextStatus, ScribearServerStatus
} from '../../react-redux&middleware/redux/typesImports';
import { useEffect, useRef, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';

import { AzureRecognizer } from './azure/azureRecognizer';
import { Dispatch } from 'redux';
import { Recognizer } from './recognizer';
import { RootState } from '../../store';
import { StreamTextRecognizer } from './streamtext/streamTextRecognizer';
import { TranscriptBlock } from '../../react-redux&middleware/redux/types/TranscriptTypes';
import { WebSpeechRecognizer } from './web-speech/webSpeechRecognizer';
import { WhisperRecognizer } from './whisper/whisperRecognizer';
import { PlaybackRecognizer } from './playback/playbackRecognizer';

import { ScribearRecognizer } from './scribearServer/scribearRecognizer';
import type { SelectedOption } from '../../react-redux&middleware/redux/types/modelSelection';
import { selectSelectedModel } from '../../react-redux&middleware/redux/reducers/modelSelectionReducers';

/** Only two tiny models */
function getWhisperModelKey(selected: any): 'tiny-en-q5_1' | 'tiny-q5_1' {
  const allowed = new Set(['tiny-en-q5_1', 'tiny-q5_1']);
  if (typeof selected === 'string') {
    if (selected === 'tiny') return 'tiny-en-q5_1';
    return (allowed.has(selected) ? selected : 'tiny-en-q5_1') as any;
  }
  if (selected && typeof selected === 'object') {
    const k = (selected as any).model_key || (selected as any).key;
    if (k === 'tiny') return 'tiny-en-q5_1';
    return (allowed.has(k) ? k : 'tiny-en-q5_1') as any;
  }
  return 'tiny-en-q5_1';
}

/** Accept BCP-47 *or* plain-language labels; default wisely. */
function toWhisperCodeLoose(input: string | undefined, selectedWhisperModel: any): string {
  const model = getWhisperModelKey(selectedWhisperModel);
  const fallback = model === 'tiny-q5_1' ? 'auto' : 'en';

  if (!input || typeof input !== 'string') return fallback;
  const s = input.toLowerCase().trim();

  // If it already looks like a code (e.g., "zh-cn"), reduce to base.
  const base = s.split(/[^a-z]/)[0] || s;
  const codes = new Set([
    'en','es','fr','de','it','pt','nl','sv','da','nb','fi','pl','cs','sk','sl','hr','sr','bg','ro',
    'hu','el','tr','ru','uk','ar','he','fa','ur','hi','bn','ta','te','ml','mr','gu','kn','pa',
    'id','ms','vi','th','zh','ja','ko','auto'
  ]);
  if (codes.has(base)) return base;

  // Heuristic for common menu labels
  const map: Array<[string,string]> = [
    ['english', 'en'],
    ['chinese', 'zh'],
    ['mandarin', 'zh'],
    ['cantonese', 'zh'],
    ['japanese', 'ja'],
    ['korean', 'ko'],
    ['spanish', 'es'],
    ['french',  'fr'],
    ['german',  'de'],
    ['portuguese', 'pt'],
    ['russian', 'ru'],
    ['arabic', 'ar'],
    ['hindi', 'hi'],
    ['thai', 'th'],
    ['vietnamese', 'vi'],
  ];
  for (const [kw, code] of map) if (s.includes(kw)) return code;

  return fallback;
}

const createRecognizer = (
  currentApi: number,
  control: ControlStatus,
  azure: AzureStatus,
  streamTextConfig: StreamTextStatus,
  scribearServerStatus: ScribearServerStatus,
  selectedModelOption: SelectedOption,
  selectedWhisperModel: any,
  playbackStatus: PlaybackStatus
): Recognizer => {
  if (currentApi === API.SCRIBEAR_SERVER) {
    return new ScribearRecognizer(
      scribearServerStatus,
      selectedModelOption,
      control.speechLanguage.CountryCode
    );
  } else if (currentApi === API.PLAYBACK) {
    return new PlaybackRecognizer(playbackStatus);
  }

  if (currentApi === API.WEBSPEECH) {
    return new WebSpeechRecognizer(null, control.speechLanguage.CountryCode);
  } else if (currentApi === API.AZURE_TRANSLATION) {
    return new AzureRecognizer(null, control.speechLanguage.CountryCode, azure);
  } else if (currentApi === API.AZURE_CONVERSATION) {
    throw new Error("Not implemented");
  } else if (currentApi === API.STREAM_TEXT) {
    return new StreamTextRecognizer(
      streamTextConfig.streamTextEvent,
      'en',
      streamTextConfig.startPosition
    );
  } else if (currentApi === API.WHISPER) {
    const lang = toWhisperCodeLoose(control.speechLanguage.CountryCode, selectedWhisperModel);
    return new WhisperRecognizer(null, lang, 4, getWhisperModelKey(selectedWhisperModel));
  } else {
    throw new Error(`Unexpcted API_CODE: ${currentApi}`);
  }
}

const updateTranscript = (dispatch: Dispatch) =>
  (newFinalBlocks: Array<TranscriptBlock>, newInProgressBlock: TranscriptBlock): void => {
    batch(() => {
      for (const block of newFinalBlocks) {
        dispatch({ type: "transcript/new_final_block", payload: block });
      }
      dispatch({ type: 'transcript/update_in_progress_block', payload: newInProgressBlock });
    });
  };

export const useRecognition = (
  sRecog: SRecognition,
  api: ApiStatus,
  control: ControlStatus,
  azure: AzureStatus,
  streamTextConfig: StreamTextStatus,
  scribearServerStatus: ScribearServerStatus,
  selectedModelOption: SelectedOption,
  playbackStatus: PlaybackStatus
) => {
  const [recognizer, setRecognizer] = useState<Recognizer>();
  const dispatch = useDispatch();
  const selectedWhisperModel = useSelector(selectSelectedModel);
  const startingRef = useRef(false);

  useEffect(() => { installCOIServiceWorker(); }, []);

  useEffect(() => {
    let newRecognizer: Recognizer | null = null;
    try {
      if (api.currentApi === API.WHISPER) {
        recognizer?.stop();
        setRecognizer(undefined);
        return () => {};
      }
      newRecognizer = createRecognizer(
        api.currentApi, control, azure, streamTextConfig, scribearServerStatus,
        selectedModelOption, selectedWhisperModel, playbackStatus
      );
      newRecognizer.onTranscribed(updateTranscript(dispatch));
      setRecognizer(newRecognizer);
      if (control.listening) newRecognizer.start();
    } catch (e) {
      console.log("UseRecognition, failed to switch to new recognizer: ", e);
    }
    return () => { newRecognizer?.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    api.currentApi,
    control.speechLanguage.CountryCode,
    selectedWhisperModel
  ]);

  useEffect(() => {
    if (api.currentApi !== API.WHISPER) {
      if (!recognizer) return;
      if (control.listening) recognizer.start(); else recognizer.stop();
      return;
    }

    if (control.listening) {
      if (!recognizer && !startingRef.current) {
        startingRef.current = true;
        try {
          const r = createRecognizer(
            api.currentApi, control, azure, streamTextConfig, scribearServerStatus,
            selectedModelOption, selectedWhisperModel, playbackStatus
          );
          r.onTranscribed(updateTranscript(dispatch));
          setRecognizer(r);
          setTimeout(() => { r.start(); startingRef.current = false; }, 0);
        } catch (e) {
          console.log('Whisper lazy-create failed: ', e);
          startingRef.current = false;
        }
      } else if (recognizer) {
        recognizer.start();
      }
    } else {
      recognizer?.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    api.currentApi,
    control.listening,
    selectedWhisperModel,
    control.speechLanguage.CountryCode
  ]);

  // Live language push (handles non-BCP-47 labels too)
  useEffect(() => {
    if (api.currentApi === API.WHISPER && recognizer) {
      (recognizer as any)?.setLanguage?.(
        toWhisperCodeLoose(control.speechLanguage.CountryCode, selectedWhisperModel)
      );
    }
  }, [api.currentApi, control.speechLanguage.CountryCode, recognizer, selectedWhisperModel]);

  useEffect(() => {
    if (api.currentApi === API.AZURE_TRANSLATION && recognizer) {
      (recognizer as AzureRecognizer).addPhrases(azure.phrases);
    }
  }, [azure.phrases, api.currentApi, recognizer]);

  const transcript: string = useSelector((state: RootState) =>
    state.TranscriptReducer.transcripts[0].toString()
  );

  return transcript;
}
