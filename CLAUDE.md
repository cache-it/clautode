# CLAUDE.md — central guide for Claude Code

This repository is a **factory for Claude Code skills and subagents**. Its purpose
is to author, version, and continuously refine every skill and agent the user needs,
all from a single source of preferences. (This in-repo authoring is *continuous*; the
alignment that carries it into the local install is *one-way and occasional* — see the
prime directive below. The two should not be confused.)

**Read this file first.** It tells you how the project is structured and how to
create and update skills and agents over time. The authoritative source for *how*
files should be written is [`GUIDELINES.md`](GUIDELINES.md); this file tells you
*what to do and when*.

Your prime directive as the Claude Code agent is below: **first acquire this
project's knowledge, then use this repo to align the local Claude install with it.**

## Prime directive — learn this project, then align the local install to it

This repo is a **transferable package**: it exists to carry all of its automation,
management, organization and file-ingestion knowledge — plus the style and the
skills/agents — into the **local** Claude environment. The direction is one-way
(**repo → local**) and occasional, not a continuous two-way sync.

Two responsibilities, in order:

1. **Acquire the project's knowledge.** Read this file and [`GUIDELINES.md`](GUIDELINES.md);
   skim the catalogs (`skills/README.md`, `agents/README.md`); internalize the
   workflows below (automation, management, organization, ingestion) and the
   structure rules (Workflows D/E/F).

2. **Align the local install to this repo.** When the user wants to set up or refresh
   local (a new machine, or after this repo was updated), carry everything here into
   the local environment, **merging** with whatever already exists — never
   blind-overwriting. Offer this proactively when you see local is behind; confirm
   before any destructive step.

**After a successful alignment the repo is dormant** — not used again until the user
chooses to update its documentation or its skills/agents, which then triggers a new
alignment.

### Trigger: the `merge` keyword

When the user types **`merge`** (or runs the **`/merge`** command) — typically right
after cloning this repo — that is the signal to merge this repo's structure and
principles into the local Claude install. Run the Alignment protocol below.

### Alignment protocol (repo → local)

Goal: the local Claude install ends up carrying this repo's automation / management /
organization / ingestion knowledge and its skills & agents, cleanly merged with what
was already local — so local works on its own, without the repo.

0. **Snapshot first (reversibility).** Before writing anything to `~/.claude`, copy the
   step-2 target paths that already exist locally (`~/.claude/CLAUDE.md`, `GUIDELINES.md`,
   `skills/`, `agents/`, `templates/`) into a timestamped backup folder
   (`~/.claude/.backups/<timestamp>/`) and tell the user the one-line restore command.
   Never write to `~/.claude` without a snapshot.
1. **Inventory** what this repo provides — the workflows (this `CLAUDE.md`), the
   style (`GUIDELINES.md`), the skills, the agents, and the supporting templates —
   versus what already exists locally (`~/.claude/`). Present the plan as
   install / merge / skip per item and confirm before any write.
2. **Transfer the knowledge to the user level** so it applies in every project,
   without the repo:
   - automation/workflows + these principles → merge into `~/.claude/CLAUDE.md`
     (the global user memory Claude Code always loads);
   - style → `~/.claude/GUIDELINES.md`, referenced from that memory;
   - units → `~/.claude/skills/` and `~/.claude/agents/`;
   - the templates the workflows rely on → `~/.claude/templates/`.
   For the two prose-memory files (`~/.claude/CLAUDE.md` and `~/.claude/GUIDELINES.md`),
   write the repo-sourced content **inside stable managed-block markers**
   (`<!-- clautode:managed start -->` … `<!-- clautode:managed end -->`),
   never replacing the whole file. On a repeat run: if the markers exist, replace only
   the text between them; otherwise append a fresh block at the end — and always leave
   the user's own text outside the markers untouched. If the user appears to have
   hand-edited content inside a block, treat it as a conflict — show the differing block
   and confirm before overwriting.
3. **Merge, don't clobber.** Where a unit already exists locally and differs,
   reconcile by *behavior* using Workflow **D** (duplicates), **E** (skill
   specialization), **F** (agent disambiguation). Confirm conflicts with the user.
   Run each unit through the **Validation gate** (`GUIDELINES.md`) before writing it
   into `~/.claude`.
4. **Keep local-only items (the firewall).** Everything in `~/.claude` that this repo
   does **not** track (no same-named skill, agent, or template) is **local-only** and
   read-only to the merge — never touch it. On any name collision between a repo item
   and a local one, **never overwrite blindly**: if the two are behaviorally equivalent,
   treat it as *already aligned*; otherwise present them side by side and let the user
   decide (Workflow **D**). The two prose-memory files are governed by the managed-block
   rule in step 2, not this firewall. On a **repeat** alignment (evidenced by a prior
   snapshot in `~/.claude/.backups/` or existing managed blocks), an item this repo would
   install but that is now **absent** locally is treated as an intentional deletion —
   ask before reinstalling, never auto-restore. On a **first** alignment, absent simply
   means not-yet-installed: include it in the step-1 install plan.
5. **Converge & report.** Local now mirrors the repo's structure and carries its
   automation; report what was installed, merged, and skipped, and where the snapshot
   backup was written. The repo can then be set aside until the next update.

**Re-running `merge` is idempotent**: a repo item already present and behaviorally
equivalent is reported as *already aligned* and not re-litigated; intentional local
deletions are respected (step 4).

Workflows D/E/F are the **merge mechanism** this protocol invokes.

## Source-of-truth model

Two layers, in order of authority:

1. **[`GUIDELINES.md`](GUIDELINES.md)** — the user's personal preferences for
   writing skills and agents. This is the single source of truth for style and
   decisions. When it changes, generated files must follow.
2. **[`templates/`](templates/)** — the starting skeletons
   (`SKILL.md.template`, `agent.md.template`). Every new skill/agent begins here;
   the templates also carry the factual format notes (frontmatter fields, naming
   constraints) inline as comments.

The generated artifacts are the files under [`skills/`](skills/) and
[`agents/`](agents/).

## Repository map

```
clautode/
├── CLAUDE.md          # this file — project map + workflows (auto-loaded by Claude Code)
├── GUIDELINES.md      # user preferences = single source of truth for style
├── README.md          # human-facing overview; points back here
├── .claude/commands/
│   └── merge.md       # the `merge` slash command → runs the Alignment protocol
├── templates/         # starting skeletons (format notes inline)
│   ├── SKILL.md.template
│   ├── agent.md.template
│   └── project/       #   folder skeleton for a new documented project (Workflow H)
├── inbox/             # staging area: drop drafts here, then ingest (Workflow G)
│   ├── skills/        #   draft skills awaiting ingestion
│   └── agents/        #   draft agents awaiting ingestion
├── skills/            # one folder per skill (+ README.md catalog)
├── agents/            # one .md per subagent (+ README.md catalog)
├── projects/          # documented projects — second-brain subsystem (Workflows H, I)
│   └── <name>/        #   index.md · _guidelines.md · inbox/ · notes/ · _archive/
└── dashboard/         # OPTIONAL local viewer/editor — outside the workflows, not transferred to local
```

## Workflow A — Create a new skill or agent

There are two intake paths: create the unit **by hand** with this workflow, or drop
a draft in `inbox/` and let Claude **ingest** it via Workflow G. This workflow is
the by-hand path.

1. Copy the matching template from `templates/` into `skills/<name>/SKILL.md` or
   `agents/<name>.md`.
2. Fill it in **applying every relevant rule in `GUIDELINES.md`** and respecting
   the format notes inline in the template comments.
3. Register it in the folder's catalog (`skills/README.md` or `agents/README.md`).
4. Keep the structure consistent: **for skills, run Workflow E** (category
   hierarchy); **for agents, run Workflow F** (description disambiguation).
5. Report what was created and which guidelines were applied.

## Workflow B — Update preferences (self-update protocol)

This is the core of the project. When the user expresses a new or changed
preference at any moment — during any task, not only when editing this repo:

1. **Record it first.** Add or amend the relevant entry in `GUIDELINES.md`. If a
   preference contradicts an existing one, update the existing entry rather than
   duplicating it. Keep entries concise and declarative.
2. **Propagate it**, with different handling per artifact type:
   - **Agents** auto-update **broadly**: scan every file in `agents/` and update
     all that conflict with the new preference, then summarize the changes.
   - **Skills** are updated **one at a time**: go through `skills/` individually,
     proposing the change for each affected skill and confirming before moving to
     the next. Do not batch-rewrite all skills silently.
3. Keep the templates aligned if the preference affects the default skeleton.
4. After propagating, report which files changed and which were left untouched.

## Workflow C — Update an existing skill or agent

1. Re-read the current `GUIDELINES.md` (it may have changed since the file was
   written).
2. Apply the requested change plus any guideline the file no longer satisfies.
3. Keep the catalog entry and `description` in sync.
4. If the change alters the unit's scope, re-check the hierarchy — **Workflow E**
   for skills, **Workflow F** for agents — so no new overlap is introduced.

## Workflow D — Merge diverging / duplicate units

The merge mechanism invoked by the **Alignment protocol** (repo → local). Whenever
two units — one from the repo and one already local, or two within one side — do
nearly the same thing, **do not copy or overwrite blindly.** The goal is a clean
result with no redundant units.

1. **Inventory both sides.** List every skill and agent in this repo and every one
   already present on the target. Read each `description` and, when needed, the
   body — identify what each unit actually *does*.
2. **Detect overlaps by behavior, not by name.** Group units that do nearly the
   same thing even when their names differ (e.g. `commit-helper` vs
   `git-commit-writer`). Treat name collisions and near-duplicates the same way.
3. **Make the user reason.** For each overlapping group, present the candidates
   side by side — name, purpose, key differences — and ask the user to decide:
   keep one, merge into a single canonical unit, or keep both with a clear reason.
   Do **not** auto-pick a winner.
4. **Merge collaboratively.** When merging, produce one unit that follows
   `GUIDELINES.md`, preserving the best of each source. Pick a clear canonical name
   with the user, update the catalog, and remove the redundant file(s).
5. **Never silently delete or overwrite.** Confirm each merge/removal. After the
   pass, report what was kept, merged, and dropped, and confirm no near-duplicates
   remain.

Cleanliness is the priority: prefer one well-named unit over several overlapping
ones with divergent names.

## Workflow E — Skill specialization hierarchy (cascading)

Skills are organized as a tree of categories and subcategories. A more specific
skill should own the specific case; a more general skill must not duplicate it but
**delegate** to it. This is different from Workflow D: there two skills do the same
thing and get **merged**; here one is a *specialization* of the other and **both
stay** — the general one just points to the specific one.

When a new skill **A** is added (or whenever overlap is noticed):

1. **Classify A** by category/subcategory and find existing skills in the same
   area. Compare A's trigger examples against theirs to surface prompts that would
   fire more than one skill.
2. **Find the less-specific skill B** that A specializes — i.e. A covers a subset
   that B currently also handles in a more generic way.
3. **Refactor B:**
   - Remove from B the component now fully covered by A (the common part).
   - Add to B a pointer to A stating **when to consult A** instead
     (e.g. "For <specific case>, use the `A` skill.").
4. **Cascade.** Re-check the whole chain: A may itself be more general than some
   existing skill C (then A delegates to C), and B may have a parent that now needs
   the same treatment. Repeat up and down the hierarchy until no skill duplicates a
   more specific one and every level keeps only what is unique to it plus delegation
   pointers.
5. Handle skills **one at a time** (as in Workflow B): propose each refactor and
   confirm before moving on. Update the catalog and report the resulting structure.

Goal: a self-organizing, always-current hierarchy with no duplicated coverage and
clear "consult the more specific skill" signposts.

## Workflow F — Agent disambiguation (by description)

Agents are the analogue of Workflow E for subagents, but the mechanism differs:
subagents run in isolation and the main agent routes work to them by reading their
`description`. A "consult agent A" pointer in B's body is inert — B cannot invoke
A. So disambiguation lives in the **descriptions**, not the bodies.

When a new agent **A** overlaps a more general agent **B**:

1. **Same job?** If A and B effectively do the same thing, do **not** keep both —
   merge them (Workflow D).
2. **A more specific than B?** Keep both and draw an explicit scope boundary in the
   `description` fields:
   - In **B**, narrow the scope and add a deferral, e.g.
     "…; for <specific case>, the `A` agent is preferred."
   - In **A**, tighten the scope so it clearly owns the specific case.
3. **Cascade across descriptions.** Re-check sibling agents so every `description`
   routes unambiguously and no two compete for the same task. Use the agents' trigger
   examples as test prompts: if one example would route to two agents, tighten the
   descriptions.
4. Unlike skills, agents update **broadly** (as in Workflow B): adjust all affected
   agents in one pass, then report the new routing boundaries.

Goal: the main agent can always pick the right subagent from descriptions alone,
with no overlapping or competing scopes.

## Workflow G — Ingest from `inbox/`

The user can add units in two ways: by hand (Workflow A), or by dropping drafts/raw
docs into `inbox/skills/` or `inbox/agents/` and then asking Claude to **ingest the
inbox**. This workflow handles the second path.

When asked to ingest:

1. **Scan the inbox.** Read every item under `inbox/skills/` and `inbox/agents/`.
   Treat each as a draft or source documentation, not necessarily final format.
2. **Normalize.** For each item, produce a proper `SKILL.md` / agent `.md` that
   follows `templates/` and every relevant rule in `GUIDELINES.md` (including
   intelligently synthesized descriptions).
3. **Integrate into the structure**, before writing anything final:
   - Check for near-duplicates against existing units → **Workflow D** (merge).
   - Skills → apply the specialization hierarchy → **Workflow E**.
   - Agents → apply description disambiguation → **Workflow F**.
4. **Resolve conflicts with the user.** If a draft collides with, duplicates, or
   specializes an existing unit, present the situation and the proposed resolution
   and **confirm before writing**. Never silently overwrite.
5. **Commit to the standard locations.** Run each unit through the **Validation gate**
   (`GUIDELINES.md`) first, then write the finalized files to `skills/<name>/SKILL.md` /
   `agents/<name>.md`, and update the relevant catalog `README.md`.
6. **Clean up the inbox.** Once a draft has been correctly placed (and only then),
   **delete its source file(s) from `inbox/`**. Leave `inbox/skills/` and
   `inbox/agents/` (with their `.gitkeep`) in place.
7. **Report.** Summarize what was created/merged/specialized, what was deleted from
   the inbox, and anything left pending a user decision.

> Safety: do not delete an inbox file until its destination file exists and the user
> has confirmed any conflict resolution. If ingestion of an item is aborted, leave
> its source in `inbox/`.

## Project documentation subsystem (`projects/`)

Separate from the skills/agents factory. `projects/` holds documentation for the
user's own projects, turning raw material into organized, Obsidian-ready notes (a
"second brain"). Each project is created from the `templates/project/` skeleton and
carries its own `_guidelines.md` that governs how its docs are organized.

### Workflow H — Start a new project

When the user says to start a new project:

1. Ask for / confirm the **project name**; derive a kebab-case folder name.
2. Copy `templates/project/` to `projects/<name>/`. **Do not overwrite** an existing
   project — if the folder exists, stop and ask.
3. Set the project title in `index.md` (replace `{{Project Name}}`).
4. Tell the user it's ready and that docs go into `projects/<name>/inbox/`.

### Workflow I — Organize a project's inbox

When the user asks to organize/ingest a project's docs:

1. **Read** `projects/<name>/_guidelines.md` first — it governs this project's
   conventions — then read everything in `projects/<name>/inbox/`.
2. **Produce notes.** Turn the raw material into atomic, linked Markdown notes in
   `notes/`, following the project guidelines: one concept per note, Obsidian
   frontmatter, `[[wikilinks]]`, a `Source:` line, no orphans.
3. **Update `index.md`** (the MOC) so every new note is reachable from it.
4. **Confirm, then archive.** After the notes are written, **move** the processed
   files from `inbox/` to `_archive/` (non-destructive) — confirm first, never
   delete source material. Leave unprocessed items in `inbox/`.
5. **Report** which notes were created/updated and which sources were archived.

> This subsystem has its own per-project guidelines (`_guidelines.md`); the
> repo-wide `GUIDELINES.md` governs only skills and agents.

## Rules of engagement

- **Learn first, then align local.** Acquire the project's knowledge before acting;
  when local needs setting up or refreshing, run the Alignment protocol (repo →
  local), offering it proactively and confirming before any destructive step. Once
  local is aligned the repo is dormant until the user updates it.
- **GUIDELINES.md wins.** If a request conflicts with it, surface the conflict and
  ask before overriding; if the user confirms, update `GUIDELINES.md` too (Workflow B).
- **Never invent preferences.** If a decision is not covered by `GUIDELINES.md`,
  ask the user, then record the answer there.
- **Keep catalogs current.** Any new or removed skill/agent must be reflected in
  the relevant catalog table (`skills/README.md` / `agents/README.md`).
- **English only** for all authored content, unless the user says otherwise.
- **No secrets** committed to any file.
