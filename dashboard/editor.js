"use strict";

/* Editor page — repository tree (left) + .md editor (right).
 * Depends on common.js. */

const DEFAULT_FIELDS = [/^agents?$/i, /^skills?$/i];
let treeWrapper = null;
let enabledFields = null;
let editing = null; // { path, handle }

const treeView = document.getElementById("tree");
const filtersEl = document.getElementById("treeFilters");
const treeRefresh = document.getElementById("treeRefresh");
const ed = {
  name: document.getElementById("edName"),
  text: document.getElementById("edText"),
  save: document.getElementById("edSave"),
  reload: document.getElementById("edReload"),
  note: document.getElementById("edNote"),
};

/* --- tree rendering --- */
function renderTree(node, prefix) {
  const dirs = Object.keys(node).filter((k) => k !== "__files").sort();
  const files = (node.__files || []).slice().sort();
  let html = "<ul>";
  for (const d of dirs) {
    html += `<li><details open><summary><span class="ico">📁</span>${escapeHtml(d)}</summary>` +
            renderTree(node[d], prefix + d + "/") + "</details></li>";
  }
  for (const f of files) {
    const md = /\.md$/i.test(f);
    const path = prefix + f;
    html += `<li class="file${md ? " md" : ""}" data-path="${escapeHtml(path)}">` +
            `<span class="ico">${md ? "📝" : "📄"}</span>${escapeHtml(f)}</li>`;
  }
  return html + "</ul>";
}
function showTree(root) {
  const dirs = Object.keys(root).filter((k) => k !== "__files");
  if (!dirs.length && !(root.__files || []).length) { treeView.innerHTML = '<p class="hint">Nothing to show.</p>'; return; }
  treeView.innerHTML = renderTree(root, "");
}

function saveFilters() { lsSet("cm-filters", JSON.stringify([...enabledFields])); }
function loadFilters() { const raw = lsGet("cm-filters"); return raw ? JSON.parse(raw) : null; }

function renderFilters(fields) {
  if (!fields.length) { filtersEl.innerHTML = ""; return; }
  let html = '<span class="filters-label">Show:</span>';
  for (const f of fields) {
    html += `<label class="chip"><input type="checkbox" data-field="${escapeHtml(f)}"${enabledFields.has(f) ? " checked" : ""}/> ${escapeHtml(f)}</label>`;
  }
  html += ' <button class="linklike" data-act="all">all</button> <button class="linklike" data-act="none">none</button>';
  filtersEl.innerHTML = html;
  filtersEl.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const f = cb.getAttribute("data-field");
      if (cb.checked) enabledFields.add(f); else enabledFields.delete(f);
      saveFilters();
      applyFilters();
    });
  });
  filtersEl.querySelectorAll("button[data-act]").forEach((b) => {
    b.addEventListener("click", () => {
      enabledFields = new Set(b.dataset.act === "all" ? fields : []);
      saveFilters();
      renderFilters(fields);
      applyFilters();
    });
  });
}

function applyFilters() {
  if (!treeWrapper) return;
  const { node } = repoNodeOf(treeWrapper);
  const filtered = {};
  for (const k of topFields(node)) if (enabledFields.has(k)) filtered[k] = node[k];
  if (node.__files) filtered.__files = node.__files; // always show root files (e.g. CLAUDE.md)
  showTree(filtered);
}

function setTree(wrapper) {
  treeWrapper = wrapper;
  const node = repoNodeOf(wrapper).node;
  const fields = topFields(node);
  const stored = loadFilters();
  const restored = stored ? stored.filter((f) => fields.includes(f)) : [];
  if (restored.length) {
    enabledFields = new Set(restored);
  } else {
    const defaults = fields.filter((f) => DEFAULT_FIELDS.some((re) => re.test(f)));
    enabledFields = new Set(defaults.length ? defaults : fields);
  }
  renderFilters(fields);
  applyFilters();
}

treeRefresh.addEventListener("click", async () => { if (rootHandle) setTree(await buildTree()); });

/* --- editor --- */
function edNote(msg, kind) { ed.note.textContent = msg || ""; ed.note.className = "hint" + (kind ? " " + kind : ""); }

async function fileHandleForPath(path) {
  const parts = path.split("/").filter(Boolean);
  const fname = parts.pop();
  let dir = rootHandle;
  for (const seg of parts) dir = await dir.getDirectoryHandle(seg);
  return dir.getFileHandle(fname);
}
function markActive(path) {
  treeView.querySelectorAll(".file").forEach((el) => el.classList.toggle("active", el.dataset.path === path));
}
async function openInEditor(path) {
  if (!rootHandle) { edNote("Open the repo folder first to edit files.", "err"); return; }
  try {
    const fh = await fileHandleForPath(path);
    editing = { path, handle: fh };
    ed.text.value = await (await fh.getFile()).text();
    ed.text.disabled = false;
    ed.save.disabled = false;
    ed.reload.disabled = false;
    ed.name.textContent = "— " + path;
    edNote("");
    markActive(path);
  } catch (e) { edNote("Could not open: " + e.message, "err"); }
}

treeView.addEventListener("click", (e) => {
  const li = e.target.closest("li.file.md");
  if (li && li.dataset.path) openInEditor(li.dataset.path);
});

ed.save.addEventListener("click", async () => {
  if (!editing) return;
  try {
    const w = await editing.handle.createWritable();
    await w.write(ed.text.value);
    await w.close();
    edNote("Saved " + editing.path, "ok");
  } catch (e) { edNote("Save failed: " + e.message, "err"); }
});
ed.reload.addEventListener("click", async () => {
  if (!editing) return;
  try { ed.text.value = await (await editing.handle.getFile()).text(); edNote("Reloaded from disk.", "ok"); }
  catch (e) { edNote("Reload failed: " + e.message, "err"); }
});

/* Called by common.js when the repo opens/reconnects. */
async function onRepoReady() { setTree(await buildTree()); }

/* init */
const cached = loadTreeCache();
if (cached) setTree(cached);
restoreRepo();
