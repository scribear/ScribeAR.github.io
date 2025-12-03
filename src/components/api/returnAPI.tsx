// src/components/api/returnAPI.tsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import type { Dispatch } from 'redux';

import type { RootState } from '../../store';

import {
  API,
  ApiStatus,
  AzureStatus,
  ControlStatus,
  PlaybackStatus,
  ScribearServerStatus,
  StreamTextStatus,
  STATUS,
} from '../../react-redux&middleware/redux/typesImports';

import { TranscriptBlock } from '../../react-redux&middleware/redux/types/TranscriptTypes';

// Recognizer interface + concrete backends
import { Recognizer } from './recognizer';
import { WebSpeechRecognizer } from './web-speech/webSpeechRecognizer';
import { AzureRecognizer } from './azure/azureRecognizer';
import { StreamTextRecognizer } from './streamtext/streamTextRecognizer';
import { WhisperRecognizer } from './whisper/whisperRecognizer';
import { ScribearRecognizer } from './scribearServer/scribearRecognizer';
import { PlaybackRecognizer } from './playback/playbackRecognizer';

// Model selection type
import type { SelectedOption } from '../../react-redux&middleware/redux/types/modelSelection';

/**
 * Normalize BCP-47 speech language like "en-US" into a Whisper language code ("en").
 */
const toWhisperLanguage = (bcp47: string | undefined | null): string => {
  if (!bcp47) return 'en';
  const lower = bcp47.toLowerCase();
  const dash = lower.indexOf('-');
  return dash > 0 ? lower.slice(0, dash) : lower;
};

/**
 * Normalize model keys so the UI and the recognizer agree.
 * In particular, tiny-multi → tiny-q5_1 (the multilingual tiny model).
 */
const normalizeModelKey = (raw: string | undefined | null): string => {
  if (!raw) return 'tiny-en-q5_1';
  if (raw === 'tiny-multi' || raw === 'tiny-multi-q5_1') return 'tiny-q5_1';
  return raw;
};

/**
 * Try to extract the model key from whatever shape SelectedOption currently has.
 */
const extractModelKeyFromSelected = (selected?: SelectedOption | null): string => {
  if (!selected) return 'tiny-en-q5_1';

  const obj: any = selected;
  const raw =
    obj.model_key ??
    obj.id ??
    obj.key ??
    obj.value ??
    obj.name ??
    obj.label ??
    'tiny-en-q5_1';

  return normalizeModelKey(raw);
};

const isEnglishOnlyModel = (modelKey: string): boolean =>
  modelKey.includes('-en') || modelKey.endsWith('.en');

/**
 * Given the current API choice and config, build the appropriate Recognizer.
 */
const createRecognizer = (
  currentApi: number,
  control: ControlStatus,
  azure: AzureStatus,
  streamTextConfig: StreamTextStatus,
  scribearServerStatus: ScribearServerStatus,
  selectedModelOption: SelectedOption | null,
  playbackStatus: PlaybackStatus,
): Recognizer => {
  if (currentApi === API.SCRIBEAR_SERVER) {
    return new ScribearRecognizer(
      scribearServerStatus,
      selectedModelOption,
      control.speechLanguage.CountryCode,
    );
  }

  if (currentApi === API.PLAYBACK) {
    return new PlaybackRecognizer(playbackStatus);
  }

  if (currentApi === API.WEBSPEECH) {
    return new WebSpeechRecognizer(null, control.speechLanguage.CountryCode);
  }

  if (currentApi === API.AZURE_TRANSLATION) {
    return new AzureRecognizer(null, control.speechLanguage.CountryCode, azure);
  }

  if (currentApi === API.AZURE_CONVERSATION) {
    throw new Error('Azure Conversation API is not implemented');
  }

  if (currentApi === API.STREAM_TEXT) {
    // Placeholder – this recognizer will likely be replaced with a real StreamText backend.
    return new StreamTextRecognizer(
      streamTextConfig.streamTextEvent,
      'en',
      streamTextConfig.startPosition,
    );
  }

  if (currentApi === API.WHISPER) {
    const modelKey = extractModelKeyFromSelected(selectedModelOption);
    const userLang = toWhisperLanguage(control.speechLanguage.CountryCode);

    // If a multilingual model is chosen and user language is still default 'en',
    // let whisper auto-detect instead of pinning to English.
    const whisperLang =
      isEnglishOnlyModel(modelKey) || userLang !== 'en' ? userLang : 'auto';

    return new WhisperRecognizer(
      null,
      whisperLang,
      4, // number of threads
      modelKey,
    );
  }

  throw new Error(`Unexpected API code: ${currentApi}`);
};

/**
 * Build a transcript-update callback that dispatches Redux actions.
 */
const makeTranscriptUpdater =
  (dispatch: Dispatch) =>
  (newFinalBlocks: TranscriptBlock[], newInProgressBlock: TranscriptBlock) => {
    batch(() => {
      newFinalBlocks.forEach((block) => {
        dispatch({
          type: 'transcript/new_final_block',
          payload: block,
        });
      });

      dispatch({
        type: 'transcript/update_in_progress_block',
        payload: newInProgressBlock,
      });
    });
  };

/**
 * Hook that manages the lifetime of the current Recognizer and returns
 * the combined transcript string for the main speaker (index 0).
 *
 * RecogComponent should call this hook and pass the transcript into STTRenderer.
 */
export const useRecognition = (
  _sRecog: any, // kept for compatibility with existing call sites
  apiStatus: ApiStatus,
  control: ControlStatus,
  azure: AzureStatus,
  streamTextConfig: StreamTextStatus,
  scribearServerStatus: ScribearServerStatus,
  selectedModelOption: SelectedOption | null,
  playbackStatus: PlaybackStatus,
): string => {
  const dispatch = useDispatch();

  // Multi-speaker transcript object is stored in Redux.
  const transcriptState: any = useSelector(
    (state: RootState) => (state as any).TranscriptReducer,
  );

  const [recognizer, setRecognizer] = useState<Recognizer | null>(null);

  // (Re)create recognizer whenever API or its configuration changes
  useEffect(() => {
    const newRecognizer = createRecognizer(
      apiStatus.currentApi,
      control,
      azure,
      streamTextConfig,
      scribearServerStatus,
      selectedModelOption,
      playbackStatus,
    );

    newRecognizer.onTranscribed(makeTranscriptUpdater(dispatch));
    newRecognizer.onError((err) => {
      console.error('Recognizer error:', err);
      dispatch({
        type: 'CHANGE_API_STATUS',
        payload: {
          ...apiStatus,
          webspeechStatus: STATUS.ERROR,
        },
      });
    });

    // Stop any previous recognizer before switching
    setRecognizer((prev) => {
      if (prev) {
        try {
          prev.stop();
        } catch (e) {
          console.warn('Error stopping old recognizer', e);
        }
      }
      return newRecognizer;
    });

    // Cleanup when this effect is torn down (e.g. API changed)
    return () => {
      try {
        newRecognizer.stop();
      } catch (e) {
        console.warn('Error stopping recognizer on cleanup', e);
      }
    };
  }, [
    apiStatus,
    control,
    azure,
    streamTextConfig,
    scribearServerStatus,
    selectedModelOption,
    playbackStatus,
    dispatch,
  ]);

  // Start/stop recognizer when the listening flag changes
  useEffect(() => {
    if (!recognizer) return;

    if (control.listening) {
      try {
        recognizer.start();
      } catch (e) {
        console.error('Error starting recognizer', e);
      }
    } else {
      try {
        recognizer.stop();
      } catch (e) {
        console.error('Error stopping recognizer', e);
      }
    }
  }, [control.listening, recognizer]);

  // Turn the multi-speaker transcript into a single string for speaker 0
  const transcript0 = transcriptState?.transcripts?.[0];

  let transcriptText = '';
  if (transcript0) {
    if (typeof transcript0.toString === 'function') {
      transcriptText = transcript0.toString();
    } else if (typeof transcript0.text === 'string') {
      transcriptText = transcript0.text;
    }
  }

  return transcriptText;
};

// Allow default import as well: import useRecognition from "./returnAPI";
export default useRecognition;
