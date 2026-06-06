# projects — documented projects (second brain)

This subsystem manages **documentation for my projects**, separate from the
skills/agents factory. Each project turns raw material into organized,
Obsidian-ready notes.

## How it works

- Tell Claude to **start a new project** → it creates `projects/<name>/` from
  [`../templates/project/`](../templates/project/) (**Workflow H** in `../CLAUDE.md`).
- Drop docs into that project's `inbox/`.
- Tell Claude to **organize** the project → it produces linked notes in `notes/`
  and updates `index.md` (**Workflow I**).

## Per-project layout

```
projects/<name>/
├── index.md        # Map of Content (MOC) — entry point, Obsidian graph hub
├── _guidelines.md  # how this project's docs are organized (editable per project)
├── inbox/          # raw docs you drop in, awaiting organization
├── notes/          # organized, linked Markdown notes (the output)
└── _archive/       # processed inbox sources, kept (not deleted)
```

> An empty `projects/` folder is normal — projects are created on demand.
