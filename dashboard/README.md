# dashboard — local viewer & editor

A dependency-free static site (HTML/CSS/JS) of **two pages**, linked by a top nav:

- **`index.html` — Dashboard:** the opened folder's `CLAUDE.md` rendered, with
  **analytics** on the right (number of skills and agents configured).
- **`editor.html` — Editor:** the **repository tree** on the left; click a `.md`
  file to open it in the **editor** on the right and **Save** changes back to disk
  (**Reload** discards).

Files: `index.html` + `dashboard.js`, `editor.html` + `editor.js`, shared
`common.js` (repo access, tree, persistence) and `style.css`.

## Run it

A single entry point — **Open repo folder** — uses the File System Access API, so the
site must be **served** (Chrome/Edge over http):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/dashboard/
```

Click **Open repo folder** and pick the repo root. That one action powers both pages,
the tree, and saving (the chosen repo is shared across the two pages).

## Details

- The tree hides the repo root and visually distinguishes folders 📁 from files 📄/📝.
  Ignores `.git`, `.DS_Store`, `node_modules`, `.idea`. A **field filter** lists the
  top-level folders as chips — **`agents` and `skills` are on by default**; root-level
  files (e.g. `CLAUDE.md`) are always shown so they stay editable.
- Analytics count skills (folders under `skills/` with a `SKILL.md`) and agents
  (`.md` files under `agents/`, excluding `README.md`).

## Saved between sessions

Persisted in `localStorage` (restored on load, shared by both pages): the **filter
choices**, the cached **tree**/**analytics**, and the cached **CLAUDE.md** view.
The **opened repo** is kept in IndexedDB and reconnects automatically when the
browser still grants access; otherwise a **Reconnect (name)** button appears.

> [!IMPORTANT]
> **Open repo folder** needs the File System Access API → serve the site (Chrome/Edge
> over http). Opened as a `file://`, it's disabled; cached tree/CLAUDE.md still render
> read-only, but loading, editing and saving require the served site.
