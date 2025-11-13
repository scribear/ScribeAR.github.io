// Robust, silent caching + URL fallbacks for Whisper model binaries

var dbVersion = 1;
var dbName    = 'whisper.ggerganov.com';
var _indexedDB =
  (window.indexedDB ||
   window.mozIndexedDB ||
   window.webkitIndexedDB ||
   window.msIndexedDB);

// --- tiny helpers -----------------------------------------------------------

function log(cbPrint, msg){ try { cbPrint && cbPrint(msg); } catch(_){} }

function isValidModelBytes(buf, contentType) {
  if (!buf) return false;
  // Reject obvious HTML/JSON or tiny payloads (typical CRA index.html ~2–5 KB)
  if (buf.byteLength < 4096) return false;
  if (!contentType) return true;
  const ct = String(contentType).toLowerCase();
  if (ct.includes('text/html')) return false;
  if (ct.includes('json'))      return false;
  return true;
}

// Fetch bytes from a URL (no prompt, no cache), return Uint8Array or null
async function fetchBytes(url, cbProgress, cbPrint) {
  log(cbPrint, 'fetchRemote: GET ' + url);
  const res = await fetch(url, { cache: 'no-cache', method: 'GET' });
  if (!res.ok) {
    log(cbPrint, 'fetchRemote: HTTP ' + res.status + ' @ ' + url);
    return null;
  }
  const totalHdr = res.headers.get('content-length');
  const total = totalHdr ? parseInt(totalHdr, 10) : undefined;

  // If stream not available, do arrayBuffer directly
  if (!res.body || !res.body.getReader) {
    const buf = await res.arrayBuffer();
    if (!isValidModelBytes(buf, res.headers.get('content-type'))) return null;
    cbProgress && cbProgress(1);
    return new Uint8Array(buf);
  }

  const reader = res.body.getReader();
  let received = 0, chunks = [], lastReport = -1;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) {
      const frac = received / total;
      cbProgress && cbProgress(frac);
      const bucket = Math.round(frac * 10);
      if (bucket !== lastReport) {
        log(cbPrint, 'fetchRemote: fetching ' + (bucket * 10) + '% ...');
        lastReport = bucket;
      }
    }
  }

  // Concat
  const out = new Uint8Array(received);
  let pos = 0;
  for (let i = 0; i < chunks.length; i++) {
    out.set(chunks[i], pos);
    pos += chunks[i].length;
  }

  // Final sanity
  const ct = res.headers.get('content-type');
  if (!isValidModelBytes(out, ct)) return null;
  if (!total) { cbProgress && cbProgress(1); }

  return out;
}

// IDB helpers
function idbGet(db, key) {
  return new Promise(resolve => {
    try {
      const tx = db.transaction(['models'], 'readonly');
      const os = tx.objectStore('models');
      const rq = os.get(key);
      rq.onsuccess = () => resolve(rq.result || null);
      rq.onerror   = () => resolve(null);
    } catch (_) { resolve(null); }
  });
}

function idbPut(db, key, bytes, cbPrint) {
  return new Promise(resolve => {
    try {
      const tx = db.transaction(['models'], 'readwrite');
      const os = tx.objectStore('models');
      const rq = os.put(bytes, key);
      rq.onsuccess = () => { log(cbPrint, 'loadRemote: stored in IDB: ' + key); resolve(true); };
      rq.onerror   = () => { log(cbPrint, 'loadRemote: IDB put failed (non-fatal)'); resolve(false); };
    } catch (e) {
      log(cbPrint, 'loadRemote: IDB exception: ' + e);
      resolve(false);
    }
  });
}

function openDB(cbPrint) {
  return new Promise(resolve => {
    const rq = _indexedDB.open(dbName, dbVersion);
    rq.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains('models')) {
        db.createObjectStore('models', { autoIncrement: false });
        log(cbPrint, 'loadRemote: created IDB store');
      }
    };
    rq.onsuccess = () => resolve(rq.result);
    rq.onerror   = () => resolve(null);
    rq.onblocked = () => resolve(null);
    rq.onabort   = () => resolve(null);
  });
}

// --- PUBLIC: try a list of URLs, use cache per-URL, stop on first good one ---
export async function loadRemoteWithFallbacks(urls, dst, size_mb, cbProgress, cbReady, cbCancel, cbPrint) {
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      log(cbPrint, 'loadRemote: storage quota: ' + est.quota + ' bytes');
      log(cbPrint, 'loadRemote: storage usage: ' + est.usage + ' bytes');
    }
  } catch (_) {}

  // De-dup & filter falsy
  const list = Array.from(new Set((urls || []).filter(Boolean)));
  if (!list.length) { cbCancel && cbCancel(); return; }

  const db = await openDB(cbPrint);

  for (let i = 0; i < list.length; i++) {
    const url = list[i];

    // 1) Cache hit?
    if (db) {
      const cached = await idbGet(db, url);
      if (cached && cached.byteLength > 4096) {
        log(cbPrint, `loadRemote: cache hit for ${url}`);
        cbReady && cbReady(dst, cached instanceof Uint8Array ? cached : new Uint8Array(cached));
        return;
      }
    }

    log(cbPrint, `loadRemote: cache miss; downloading ~${size_mb} MB`);
    const bytes = await fetchBytes(url, cbProgress, cbPrint);
    if (bytes && bytes.byteLength > 4096) {
      if (db) { await idbPut(db, url, bytes, cbPrint); }
      cbReady && cbReady(dst, bytes);
      return;
    } else {
      log(cbPrint, `fetchWithFallbacks: "${url}" did not look like a model, trying next...`);
    }
  }

  // All failed
  log(cbPrint, 'loadRemote: all fetch attempts failed');
  cbCancel && cbCancel();
}
