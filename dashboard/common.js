"use strict";

/* Shared across both pages (index.html = Dashboard, editor.html = Editor).
 * Loaded before the page-specific script. Each page may define a global
 * async `onRepoReady()` hook, called whenever the repo becomes available. */

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let rootHandle = null;    // open repo directory handle
let storedHandle = null;  // saved handle pending reconnect

const fsSupported = "showDirectoryPicker" in window;
const IGNORE = new Set([".git", ".DS_Store", "node_modules", ".idea"]);

const fsStatus = document.getElementById("fsStatus");
const connectBtn = document.getElementById("connectBtn");

if (!fsSupported) {
  connectBtn.disabled = true;
  connectBtn.title = "This browser lacks the File System Access API — serve the page over http and use Chrome/Edge";
}

/* --- storage helpers --- */
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("cm-dashboard", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbSet(key, val) {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(val, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function idbGet(key) {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction("kv", "readonly");
    const rq = tx.objectStore("kv").get(key);
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
async function verifyPermission(handle, request) {
  const opts = { mode: "readwrite" };
  if ((await handle.queryPermission(opts)) === "granted") return true;
  if (request && (await handle.requestPermission(opts)) === "granted") return true;
  return false;
}

/* --- tree data (shared by both pages) --- */
async function treeFromHandle(dir, depth) {
  const node = {};
  const entries = [];
  for await (const [name, h] of dir.entries()) if (!IGNORE.has(name)) entries.push([name, h]);
  for (const [name, h] of entries) {
    if (h.kind === "directory" && depth < 8) node[name] = await treeFromHandle(h, depth + 1);
    else (node.__files = node.__files || []).push(name);
  }
  return node;
}
function repoNodeOf(wrapper) {
  const keys = Object.keys(wrapper).filter((k) => k !== "__files");
  if (keys.length === 1 && !(wrapper.__files || []).length) return { node: wrapper[keys[0]] };
  return { node: wrapper };
}
function topFields(node) { return Object.keys(node).filter((k) => k !== "__files").sort(); }

function saveTree(w) { lsSet("cm-tree", JSON.stringify(w)); }
function loadTreeCache() { const raw = lsGet("cm-tree"); return raw ? JSON.parse(raw) : null; }

async function buildTree() {
  const wrap = {}; wrap[rootHandle.name] = await treeFromHandle(rootHandle, 0);
  saveTree(wrap);
  return wrap;
}

/* --- open / reconnect repo --- */
function markConnected() {
  fsStatus.textContent = "repo: open (" + rootHandle.name + ")";
  fsStatus.className = "badge badge-on";
  if (reconnectBtn) reconnectBtn.hidden = true;
}

async function connectTo(handle) {
  rootHandle = handle;
  storedHandle = handle;
  await idbSet("repoHandle", handle).catch(() => {});
  markConnected();
  if (typeof onRepoReady === "function") await onRepoReady();
}

connectBtn.addEventListener("click", async () => {
  try { await connectTo(await window.showDirectoryPicker()); } catch (e) { /* cancelled */ }
});

let reconnectBtn = null;
if (fsSupported) {
  reconnectBtn = document.createElement("button");
  reconnectBtn.hidden = true;
  connectBtn.parentNode.insertBefore(reconnectBtn, connectBtn);
  reconnectBtn.addEventListener("click", async () => {
    if (storedHandle && (await verifyPermission(storedHandle, true))) connectTo(storedHandle);
  });
}

// Call from each page's init (after defining onRepoReady).
async function restoreRepo() {
  if (!fsSupported) return;
  try {
    const handle = await idbGet("repoHandle");
    if (!handle) return;
    storedHandle = handle;
    if (await verifyPermission(handle, false)) {
      rootHandle = handle;
      markConnected();
      if (typeof onRepoReady === "function") await onRepoReady();
    } else if (reconnectBtn) {
      reconnectBtn.hidden = false;
      reconnectBtn.textContent = "Reconnect (" + handle.name + ")";
      fsStatus.textContent = "repo: saved (" + handle.name + ")";
    }
  } catch (e) { /* ignore */ }
}
