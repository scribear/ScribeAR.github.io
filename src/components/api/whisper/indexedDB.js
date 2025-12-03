// src/components/api/whisper/indexedDB.js
// Silent IndexedDB caching loader with multi-URL fallbacks.

var dbVersion = 1;
var dbName = 'whisper.ggerganov.com';
var indexedDB =
  (window.indexedDB ||
   window.mozIndexedDB ||
   window.webkitIndexedDB ||
   window.msIndexedDB);

// fetch a URL as a Uint8Array (progress callback optional)
async function fetchBinary(url, cbProgress, cbPrint) {
  cbPrint && cbPrint('fetchBinary: GET ' + url);

  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });
  if (!res.ok) throw new Error('http-' + res.status);

  // No stream? Just read all at once.
  if (!res.body || !res.body.getReader) {
    const buf = new Uint8Array(await res.arrayBuffer());
    cbProgress && cbProgress(1);
    return buf;
  }

  const total = parseInt(res.headers.get('content-length') || '0', 10) || 0;
  const reader = res.body.getReader();

  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total && cbProgress) cbProgress(received / total);
  }

  const out = new Uint8Array(received);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  if (!total && cbProgress) cbProgress(1);
  return out;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const rq = indexedDB.open(dbName, dbVersion);
    rq.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains('models')) {
        db.createObjectStore('models', { autoIncrement: false });
      }
    };
    rq.onsuccess = () => resolve(rq.result);
    rq.onerror = () => reject(new Error('idb-open'));
    rq.onblocked = () => reject(new Error('idb-blocked'));
    rq.onabort = () => reject(new Error('idb-abort'));
  });
}

async function getCached(db, key) {
  try {
    return await new Promise((resolve) => {
      const tx = db.transaction(['models'], 'readonly');
      const os = tx.objectStore('models');
      const g = os.get(key);
      g.onsuccess = () => {
        let v = g.result;
        if (v && v instanceof ArrayBuffer) v = new Uint8Array(v);
        resolve(v || null);
      };
      g.onerror = () => resolve(null);
    });
  } catch { return null; }
}

async function putCached(db, key, data, cbPrint) {
  try {
    await new Promise((resolve) => {
      const tx = db.transaction(['models'], 'readwrite');
      const os = tx.objectStore('models');
      const p = os.put(data, key);
      p.onsuccess = () => { cbPrint && cbPrint('IDB: stored ' + key); resolve(); };
      p.onerror = () => resolve();
    });
  } catch (e) { cbPrint && cbPrint('IDB store error: ' + e); }
}

// MAIN: try urls in order; cache successful one under that exact url key.
export async function loadRemoteWithFallbacks(urls, dst, sizeMB, cbProgress, cbReady, cbCancel, cbPrint) {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      cbPrint && cbPrint(`IDB quota ~${est.quota}, used ~${est.usage}`);
    }
  } catch {}

  let db = null;
  try { db = await openDB(); } catch { db = null; }

  const tinyBlob = (b) => !b || (b.length || 0) < 4096;
  const urlList = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);

  if (urlList.length === 0) {
    cbCancel && cbCancel();
    return;
  }

  for (const url of urlList) {
    try {
      // cache hit?
      if (db) {
        const cached = await getCached(db, url);
        if (cached && !tinyBlob(cached)) {
          cbReady(dst, cached);
          return;
        }
      }

      cbPrint && cbPrint(`loadRemote: fetching ~${sizeMB} MB from ${url}`);
      const data = await fetchBinary(url, cbProgress, cbPrint);
      if (tinyBlob(data)) throw new Error('tiny-blob');
      if (db) await putCached(db, url, data, cbPrint);
      cbReady(dst, data);
      return;
    } catch (e) {
      cbPrint && cbPrint(`loadRemote: failed on ${url} (${e}), trying next...`);
    }
  }

  cbCancel();
}
