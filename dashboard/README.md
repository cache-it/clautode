# 📊 dashboard — local viewer & editor

A small, **optional** static site for browsing and editing this repo in a browser.
It is a convenience layer on top of the package — **secondary to the core
repo→local alignment** described in [`../CLAUDE.md`](../CLAUDE.md) — and lives
**outside** every workflow: it is **not** carried into `~/.claude/` by the Alignment
protocol. Delete it and the factory still works.

Dependency-free: plain HTML/CSS/JS, no build step, no framework, no tooling — in
keeping with the package's Markdown-first, low-ceremony ethos.

## What it is

Two pages, linked by a top nav, sharing one opened repo folder:

- **`index.html` — Dashboard:** renders the opened folder's `CLAUDE.md` and shows
  **analytics** alongside it (how many skills and agents are configured).
- **`editor.html` — Editor:** the **repository tree** on the left; click a `.md`
  file to open it in the editor on the right, then **Save** changes back to disk
  (**Reload** discards them).

> [!NOTE]
> The `CLAUDE.md` view uses a tiny built-in Markdown renderer (headings, lists,
> code, tables, blockquotes, GitHub `[!NOTE]`/`[!TIP]`/`[!IMPORTANT]` admonitions).
> It is a preview, not a full CommonMark/GFM engine.

## Structure

```
dashboard/
├── index.html      # Dashboard page (CLAUDE.md + analytics)
├── editor.html     # Editor page (tree + .md editing)
├── dashboard.js    # Dashboard logic + Markdown renderer
├── editor.js       # Tree rendering, filters, file open/save
├── common.js       # Shared: repo access, tree build, persistence (loaded first)
└── style.css       # Shared styling
```

`common.js` loads before each page's script and exposes the shared repo handle,
tree builder, and storage helpers; each page defines an `onRepoReady()` hook that
`common.js` calls whenever the repo opens or reconnects.

## Run it

A single entry point — **Open repo folder** — uses the browser's
[File System Access API](https://developer.mozilla.org/docs/Web/API/File_System_API),
so the site must be **served over http** in a supporting browser (Chrome/Edge):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/dashboard/
```

Click **Open repo folder** and pick the repo root. That one action powers both
pages — the `CLAUDE.md` view, the analytics, the tree, and saving. The chosen repo
is shared across the two pages.

> [!IMPORTANT]
> Opened directly as a `file://` page the **Open repo folder** button is disabled
> (no File System Access API). Any cached tree / `CLAUDE.md` still render read-only,
> but loading, editing, and saving require the served site. The Dashboard page can
> additionally fall back to fetching `../CLAUDE.md` over http when no folder is open.

## Details (faithful to the code)

**Tree** — `common.js` walks the picked directory (recursing up to 8 levels) and
wraps it under the repo's own folder name; the UI then unwraps that single root so
its contents show directly. Folders render as 📁; files as 📝 (`.md`, clickable to
edit) or 📄 (everything else, shown but not editable). Ignored everywhere:
`.git`, `.DS_Store`, `node_modules`, `.idea`.

**Filter chips (Editor only)** — the top-level folders become checkbox **chips**
under a "Show:" label, with **all** / **none** shortcuts. **`agents` and `skills`
are enabled by default** (matched case-insensitively, singular or plural). Root-level
**files** (e.g. `CLAUDE.md`) are **always shown** regardless of the chips, so they
stay editable. The Dashboard page has no chips.

**Analytics (Dashboard only)** — counted from the tree:

- **Skills** = folders under `skills/` that contain a `SKILL.md` (case-insensitive).
- **Agents** = `.md` files directly under `agents/`, **excluding** `README.md`.

Each stat shows the count plus the sorted list of names.

## Saved between sessions

| Where | Key | Holds |
| --- | --- | --- |
| `localStorage` | `cm-filters` | the Editor's chip selection |
| `localStorage` | `cm-tree` | the cached repository tree |
| `localStorage` | `cm-claude` | the cached `CLAUDE.md` text for the preview |
| IndexedDB (`cm-dashboard` → `kv`) | `repoHandle` | the opened directory handle |

On load, the cached tree and `CLAUDE.md` render immediately so the pages are not
blank. **Analytics are recomputed from the cached tree, not stored** — there is no
separate analytics cache.

The opened repo handle lives in **IndexedDB** and **reconnects automatically** when
the browser still grants permission. If permission lapsed, a **Reconnect (name)**
button appears in the top bar; one click restores access. The status badge shows
`repo: open / saved / not open` accordingly.

---

For the package as a whole, start at the root [`README.md`](../README.md) and
[`CLAUDE.md`](../CLAUDE.md). Authoring style for the units this site browses lives
in [`GUIDELINES.md`](../GUIDELINES.md).

