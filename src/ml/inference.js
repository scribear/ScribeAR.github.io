/** */
/*global BigInt */
/*global BigInt64Array */

import { loadTokenizer } from './bert_tokenizer.ts';
// Setup onnxruntime
const ort = require('onnxruntime-web');

// --- CONFIG -----------------------------------------------------------------

// We resolve URLs against PUBLIC_URL (prod) or root (dev)
function resolvePublicUrl(path) {
  const base =
    (process.env.NODE_ENV === 'development'
      ? ''
      : (process.env.PUBLIC_URL || '')
    ).replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Place these files in public/models/onnx/
const LM_MODEL_URL  = resolvePublicUrl('/models/onnx/xtremedistill-go-emotion-int8.onnx');
// Note: parentheses are valid in URLs; we encode to be safe.
const GRU_MODEL_URL = resolvePublicUrl('/models/onnx/' + encodeURI('gru_embedder(1,40,80).onnx'));

const ORT_OPTIONS = {
  executionProviders: ['wasm'],
  graphOptimizationLevel: 'all',
};

// --- INTERNAL STATE ---------------------------------------------------------

let downloadingModel = false;

let lmSessionPromise = null;   // Promise<InferenceSession|null>
let gruSessionPromise = null;  // Promise<InferenceSession|null>

let lmDisabled  = false;
let gruDisabled = false;

// tokenizer promise (unchanged)
const tokenizer = loadTokenizer();

// --- HELPERS ----------------------------------------------------------------

async function fetchModelBytes(url) {
  // Fetch to ArrayBuffer first so we can reject HTML/JSON and tiny files
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  const buf = await res.arrayBuffer();

  // Reject clearly-wrong payloads (HTML/JSON or super tiny files)
  if (buf.byteLength < 2048 || ct.includes('text/html') || ct.includes('json')) {
    throw new Error(`Invalid model payload (type=${ct}, size=${buf.byteLength}) @ ${url}`);
  }
  return buf;
}

function sortResult(a, b) {
  if (a[1] === b[1]) return 0;
  return (a[1] < b[1]) ? 1 : -1;
}

function sigmoid(t) {
  return 1 / (1 + Math.exp(-t));
}

// Build BERT inputs (BigInt)
function create_model_input(encoded) {
  let input_ids = new Array(encoded.length + 2);
  let attention_mask = new Array(encoded.length + 2);
  let token_type_ids = new Array(encoded.length + 2);

  input_ids[0]       = BigInt(101);
  attention_mask[0]  = BigInt(1);
  token_type_ids[0]  = BigInt(0);

  let i = 0;
  for (; i < encoded.length; i++) {
    input_ids[i + 1]      = BigInt(encoded[i]);
    attention_mask[i + 1] = BigInt(1);
    token_type_ids[i + 1] = BigInt(0);
  }

  input_ids[i + 1]      = BigInt(102);
  attention_mask[i + 1] = BigInt(1);
  token_type_ids[i + 1] = BigInt(0);

  const seq = input_ids.length;

  input_ids      = new ort.Tensor('int64', BigInt64Array.from(input_ids),      [1, seq]);
  attention_mask = new ort.Tensor('int64', BigInt64Array.from(attention_mask), [1, seq]);
  token_type_ids = new ort.Tensor('int64', BigInt64Array.from(token_type_ids), [1, seq]);

  return { input_ids, attention_mask, token_type_ids };
}

// --- CONSTANTS --------------------------------------------------------------

const EMOJI_DEFAULT_DISPLAY = [
  ['Emotion', 'Score'],
  ['admiration 👏', 0],
  ['amusement 😂',  0],
  ['neutral 😐',    0],
  ['approval 👍',   0],
  ['joy 😃',        0],
  ['gratitude 🙏',  0],
];

const EMOJIS = [
  'admiration 👏',
  'amusement 😂',
  'anger 😡',
  'annoyance 😒',
  'approval 👍',
  'caring 🤗',
  'confusion 😕',
  'curiosity 🤔',
  'desire 😍',
  'disappointment 😞',
  'disapproval 👎',
  'disgust 🤮',
  'embarrassment 😳',
  'excitement 🤩',
  'fear 😨',
  'gratitude 🙏',
  'grief 😢',
  'joy 😃',
  'love ❤️',
  'nervousness 😬',
  'optimism 🤞',
  'pride 😌',
  'realization 💡',
  'relief 😅',
  'remorse 😞',
  'sadness 😞',
  'surprise 😲',
  'neutral 😐',
];

// --- LAZY SESSION INITIALIZERS ---------------------------------------------

async function ensureLmSession() {
  if (lmDisabled) return null;
  if (lmSessionPromise) return lmSessionPromise;

  downloadingModel = true;
  lmSessionPromise = (async () => {
    try {
      const bytes = await fetchModelBytes(LM_MODEL_URL);
      const session = await ort.InferenceSession.create(bytes, ORT_OPTIONS);
      return session;
    } catch (err) {
      console.warn('[inference] LM disabled:', err);
      lmDisabled = true;
      return null;
    } finally {
      downloadingModel = false;
    }
  })();

  return lmSessionPromise;
}

async function ensureGruSession() {
  if (gruDisabled) return null;
  if (gruSessionPromise) return gruSessionPromise;

  downloadingModel = true;
  gruSessionPromise = (async () => {
    try {
      const bytes = await fetchModelBytes(GRU_MODEL_URL);
      const session = await ort.InferenceSession.create(bytes, ORT_OPTIONS);
      return session;
    } catch (err) {
      console.warn('[inference] GRU disabled:', err);
      gruDisabled = true;
      return null;
    } finally {
      downloadingModel = false;
    }
  })();

  return gruSessionPromise;
}

// --- PUBLIC API -------------------------------------------------------------

function isDownloading() {
  return downloadingModel;
}

async function lm_inference(text) {
  try {
    const session = await ensureLmSession();
    if (!session) return [0.0, EMOJI_DEFAULT_DISPLAY];

    const encoded_ids = await tokenizer.then(t => t.tokenize(text));
    if (!encoded_ids || encoded_ids.length === 0) {
      return [0.0, EMOJI_DEFAULT_DISPLAY];
    }

    const start = performance.now();
    const feeds = create_model_input(encoded_ids);
    const output = await session.run(feeds, ['output_0']);

    const duration = (performance.now() - start).toFixed(1);
    const probs = output['output_0'].data
      .map(sigmoid)
      .map(t => Math.floor(t * 100));

    const result = [];
    for (let i = 0; i < EMOJIS.length; i++) {
      result[i] = [EMOJIS[i], probs[i]];
    }
    result.sort(sortResult);

    const result_list = [];
    result_list[0] = ['Emotion', 'Score'];
    for (let i = 0; i < 6; i++) result_list[i + 1] = result[i];

    return [duration, result_list];
  } catch (_e) {
    // Swallow errors to keep UI smooth
    return [0.0, EMOJI_DEFAULT_DISPLAY];
  }
}

async function gru_inference(melLogSpectrogram) {
  try {
    const session = await ensureGruSession();
    if (!session) return null;

    // Expecting shape [1, 40, 80]
    const input = new ort.Tensor(
      'float32',
      melLogSpectrogram.flat(),
      [1, 40, 80]
    );

    const outputs = await session.run({ input });
    return outputs;
  } catch (e) {
    console.warn('[inference] GRU inference error:', e);
    return null;
  }
}

// Named exports kept for compatibility with your codebase
export let intent_inference = lm_inference;
export let columnNames = EMOJI_DEFAULT_DISPLAY;
export let modelDownloadInProgress = isDownloading;
export let gruInference = gru_inference;

// Optional: explicit initializer if you ever want to prefetch after a user action
export async function initOnnx() {
  await Promise.all([ensureLmSession(), ensureGruSession()]);
}
