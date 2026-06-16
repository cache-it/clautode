<div align="center">

# 🏭 Clautode

**A personal factory for [Claude Code](https://code.claude.com/docs) skills & subagents.**

Author your skills, agents and preferences here once — then let Claude Code carry them into your local install.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built for Claude Code](https://img.shields.io/badge/Built%20for-Claude%20Code-d97757)](https://code.claude.com/docs)
![Made of Markdown](https://img.shields.io/badge/Made%20of-Markdown-083fa1)

</div>

---

## TL;DR

This repo is a **transferable package** for your Claude Code setup. You keep your skills,
subagents and style preferences here in plain Markdown; Claude Code reads them and
**aligns your local install** (`~/.claude`) to match.

```bash
git clone <this-repo> && cd clautode
claude          # open Claude Code in the repo
> merge         # Claude reads CLAUDE.md and aligns your local install from this repo
```

That `merge` is the whole point. The direction is **one-way (repo → local)** and
**occasional**: Claude carries the automation, the style, and every skill/agent into
`~/.claude`, **merging** with what's already there (never blind-overwriting). Once aligned,
the repo goes **dormant** until you change something — which triggers a fresh `merge`.

---

## How it works — two files drive everything

| File | Role |
|------|------|
| 📘 **[`CLAUDE.md`](CLAUDE.md)** | The central guide Claude Code loads automatically: the prime directive (*learn the project, then align local ← repo*) plus the workflows for creating, updating, and merging skills/agents. |
| 🎯 **[`GUIDELINES.md`](GUIDELINES.md)** | Your personal preferences for **how** skills and agents are written. The single source of truth for style — when it changes, Claude propagates the change to affected files. |

You author and update skills, agents and preferences here. Everything else — installing,
merging, keeping catalogs in sync — Claude handles by following `CLAUDE.md`.

<details>
<summary><strong>📋 The workflows defined in <code>CLAUDE.md</code></strong></summary>

| | Workflow | What it does |
|---|----------|--------------|
| **A** | Create | Start from a template, apply the guidelines, register in the catalog, then run the hierarchy/disambiguation pass (E/F). |
| **B** | Update preferences | Record the new preference, then propagate it across agents & skills. |
| **C** | Update a unit | Re-apply current guidelines to an existing skill or agent. |
| **D** | Merge units | Reconcile two units that do nearly the same thing — detect overlaps by behavior and merge collaboratively, no blind copying. |
| **E** | Skill hierarchy | When a more specific skill is added, refactor the more general one to drop the overlap and point to it — cascading, so the category tree stays clean. |
| **F** | Agent disambiguation | When agents overlap, draw the scope boundary in their **descriptions** so the right subagent is always picked — no competing scopes. |
| **G** | Ingest from inbox | Drop drafts in `inbox/`, then ask Claude to ingest: it normalizes, runs D/E/F, checks conflicts with you, writes to the standard folders, and clears the inbox. |
| **H** | Start a project | Create `projects/<name>/` from the project template — its own `inbox/`, `notes/`, and `index.md`. |
| **I** | Organize a project | Turn a project's `inbox/` docs into atomic, linked Obsidian notes in `notes/`, update the MOC, and archive the sources. |

</details>

---

## Adding or updating something

Two paths to add a unit — always ask Claude Code, which follows [`CLAUDE.md`](CLAUDE.md):

- **By hand** — create it directly under [`skills/`](skills/) or [`agents/`](agents/) (Workflow A).
- **Via the inbox** — drop a draft in [`inbox/`](inbox/), then ask Claude to *ingest the inbox*: it normalizes, integrates into the hierarchy, checks conflicts, and clears the inbox (Workflow G).

To change *how* things are written, edit [`GUIDELINES.md`](GUIDELINES.md) (or just tell
Claude your new preference) — it records the change and propagates it (Workflow B).

---

## 🗂️ Repository layout

```
clautode/
├── CLAUDE.md                # central guide for Claude Code (auto-loaded)
├── GUIDELINES.md            # your preferences = single source of truth for style
│
├── skills/                  # one folder per skill (Claude Code format)
│   ├── README.md            # skills catalog
│   └── commit-helper/       # working example
│
├── agents/                  # one .md file per subagent
│   ├── README.md            # subagents catalog
│   └── code-reviewer.md     # working example
│
├── inbox/                   # staging area: drop drafts, then ask Claude to ingest
│   ├── skills/
│   └── agents/
│
├── templates/               # starting skeletons to copy (format notes inline)
│   ├── SKILL.md.template
│   ├── agent.md.template
│   └── project/             # folder skeleton for a new documented project
│
├── projects/                # documented projects — second-brain subsystem
│   └── <name>/              # index.md · _guidelines.md · inbox/ · notes/ · _archive/
│
└── dashboard/               # ⚠️ work in progress — not yet usable (see below)

# Plus .claude/commands/merge.md — the `merge` slash command (alignment trigger).
```

Each folder carries its own `README.md`:
[`skills/`](skills/README.md) · [`agents/`](agents/README.md) · [`inbox/`](inbox/README.md) ·
[`projects/`](projects/README.md) · [`dashboard/`](dashboard/README.md).

---

<details>
<summary><strong>📦 Manual install (when you'd rather not <code>merge</code>)</strong></summary>

`merge` is the recommended path — it reconciles with what's already local and transfers the
workflow knowledge into `~/.claude/CLAUDE.md` as well. But you can also link or copy individual
units directly:

| Scope | Location | When |
|-------|----------|------|
| **User** | `~/.claude/skills/` · `~/.claude/agents/` | available in all projects |
| **Project** | `<project>/.claude/skills/` · `<project>/.claude/agents/` | scoped to one repo, versioned with the team |

When two definitions share a name, the **project** one wins. These raw commands copy only the
units, **not** the workflow/style knowledge; on a machine that already has skills/agents, don't
copy blindly — let Claude run the **Alignment protocol** so near-duplicates are merged via
Workflow D.

**Symlink all units at the user level** (edit here, changes apply everywhere):

```bash
# from this repo's folder
for dir in skills/*/; do
  ln -sfn "$PWD/$dir" ~/.claude/skills/"$(basename "$dir")"
done
for file in agents/*.md; do
  [ "$(basename "$file")" = "README.md" ] && continue
  ln -sfn "$PWD/$file" ~/.claude/agents/"$(basename "$file")"
done
```

**Copy a single unit into a project:**

```bash
# from your project's folder
mkdir -p .claude/skills .claude/agents
cp -r /path/to/clautode/skills/commit-helper .claude/skills/
cp    /path/to/clautode/agents/code-reviewer.md .claude/agents/
```

</details>

<details>
<summary><strong>📚 Documenting projects (second brain)</strong></summary>

A separate subsystem under [`projects/`](projects/) turns raw docs into organized,
**Obsidian-ready** notes:

1. Ask Claude to **start a new project** → it scaffolds `projects/<name>/` from the project
   template (its own `inbox/`, `notes/`, `index.md`, `_guidelines.md`).
2. Drop your material into that project's `inbox/`.
3. Ask Claude to **organize** it → atomic, `[[wikilinked]]` notes appear in `notes/`, the
   `index.md` Map of Content is updated, and the sources are archived.

See [`projects/README.md`](projects/README.md) for the per-project layout.

</details>

<details>
<summary><strong>🖥️ Dashboard — work in progress</strong></summary>

> [!WARNING]
> The dashboard is not yet ready. The folder and its `README.md` are placeholders — the app
> is being built and is **not usable** in its current state.

The planned design is a dependency-free two-page web app: a **Dashboard** page showing the
repo's `CLAUDE.md` and skill/agent analytics, and an **Editor** page with a repository tree
and in-place `.md` editing. It will sit outside the alignment workflows and be entirely optional.

</details>

---

<div align="center">
<sub>A personal repo, public so others can use it freely · built for Claude Code, maintained with Claude</sub>
</div>