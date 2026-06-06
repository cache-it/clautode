# 🧠 projects — documented projects (second brain)

A **second-brain subsystem** that turns raw documentation for your own projects
into organized, Obsidian-ready notes. It is **separate** from the skills/agents
factory: nothing here is aligned to the local install — see the package overview in
[`../CLAUDE.md`](../CLAUDE.md). Each project lives in its own folder, created on
demand from a shared skeleton, with its own organization rules.

## How it works

Two workflows drive this subsystem (defined in [`../CLAUDE.md`](../CLAUDE.md)):

- **Workflow H — start a project.** Tell Claude to start a new project; it copies
  [`../templates/project/`](../templates/project/) to `projects/<name>/` and sets
  the title in `index.md`. It never overwrites an existing project.
- **Workflow I — organize the inbox.** Drop raw docs into the project's `inbox/`,
  then ask Claude to organize. It reads that project's `_guidelines.md`, produces
  atomic `[[wikilinked]]` notes in `notes/`, updates `index.md` (the MOC), and —
  after confirming — moves processed sources to `_archive/`.

> [!IMPORTANT]
> The repo-wide [`../GUIDELINES.md`](../GUIDELINES.md) governs **only** skills and
> agents. Each project's notes are governed by its own `_guidelines.md`, edited
> per project. They are two distinct style sources; don't conflate them.

## Per-project layout

Every project is created from [`../templates/project/`](../templates/project/) and
mirrors this structure:

```
projects/<name>/
├── index.md        # Map of Content (MOC) — entry point, Obsidian graph hub
├── _guidelines.md  # how THIS project's docs are organized (edit per project)
├── inbox/          # raw docs you drop in, awaiting organization (Workflow I)
├── notes/          # organized, atomic, [[wikilinked]] notes — the output
└── _archive/       # processed inbox sources, kept (non-destructive, never deleted)
```

| Item             | Role |
| ---------------- | ---- |
| `index.md`       | Curated MOC; every note is reachable from here, directly or via another note. |
| `_guidelines.md` | This project's note conventions (one concept per note, frontmatter, links, `Source:` line). |
| `inbox/`         | Where you drop raw material before organizing. |
| `notes/`         | The connected, atomic notes Claude produces. |
| `_archive/`      | Where processed sources land after organizing. |

## Usage

1. **Start a project.** Ask Claude to start a new project and give it a name
   (Workflow H). A `projects/<name>/` folder appears, ready to fill.
2. **Add material.** Put raw docs, exports, or drafts into
   `projects/<name>/inbox/`.
3. **Tune the rules (optional).** Edit `projects/<name>/_guidelines.md` to match
   how you want that project's notes structured.
4. **Organize.** Ask Claude to organize the project (Workflow I). It writes linked
   notes into `notes/`, refreshes `index.md`, and archives the sources.

> [!NOTE]
> An empty `projects/` folder is normal — projects are created on demand, so this
> directory may have no subfolders until you start one.

