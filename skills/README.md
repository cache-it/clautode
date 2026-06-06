# 🧩 Skills — the activatable units of the factory

Skills are the reusable capabilities this package authors and carries into the local
Claude install. A **skill** is a folder with a `SKILL.md` that Claude Code auto-loads;
its `description` decides when it fires. This folder is the catalog plus the rules for
adding, updating, and organizing skills. New here? Start at the root
[`README.md`](../README.md) and the project map in [`CLAUDE.md`](../CLAUDE.md).

## Catalog

| Skill | Description | Invocation |
|-------|-------------|------------|
| [`commit-helper`](commit-helper/SKILL.md) | Writes Conventional Commits messages from staged changes. | automatic + `/commit-helper` |

> [!IMPORTANT]
> This table is the source of truth for which skills exist — one row per skill,
> linking to its `SKILL.md`. Keep it accurate whenever a skill is added or removed
> (see [`CLAUDE.md`](../CLAUDE.md) → "Keep catalogs current").

## What a skill is

A skill packages one capability as Markdown instructions Claude can pull in on demand.
The key idea: **the `description` drives activation.** Claude reads every skill's
`description` and auto-invokes the matching one when the user's request fits — so a
specific, keyword-rich description fires reliably while a vague one almost never does.

Invocation is two ways:

- **Automatic** — Claude selects the skill from its `description`.
- **Manual** — the user runs `/<skill-name>` (e.g. `/commit-helper`).

Both are on by default. A skill opts out of auto-firing with
`disable-model-invocation: true`, or out of the slash command with
`user-invocable: false`.

## Structure

```
skill-name/
├── SKILL.md        # required: YAML frontmatter (name + description) + instructions
├── scripts/        # optional: deterministic executables, created on demand
└── references/     # optional: long docs/examples, loaded only when needed
```

Only `SKILL.md` is required. Add `scripts/` for anything that must run the same way
every time (rather than describing it in prose), and `references/` for detail that
would bloat the body — Claude loads those files only when the task needs them. Keep
the `SKILL.md` body concise: if it runs past roughly 40 lines or isn't always needed,
push the detail into `references/`. Also give each skill a few **trigger examples**
(2–3 *should-trigger* prompts, 1–2 *should-NOT*) — see the template's
`## Trigger examples`; they document intent and feed the Workflow E overlap check.

## How skills are created, updated, and organized

The mechanics live in [`CLAUDE.md`](../CLAUDE.md); the relevant workflows are:

- **Workflow A — Create.** Copy [`../templates/SKILL.md.template`](../templates/SKILL.md.template)
  to `skills/<name>/SKILL.md`, fill it applying [`../GUIDELINES.md`](../GUIDELINES.md),
  add the catalog row, then run Workflow E.
- **Workflow C — Update.** Re-read `GUIDELINES.md` (it may have changed), apply the
  edit plus any guideline the file no longer meets, and keep the catalog row and
  `description` in sync.
- **Workflow E — Specialization hierarchy.** Skills form a tree. A more specific skill
  owns its case; a more general one must not duplicate it — strip the overlap and add a
  "for `<case>`, use the `A` skill" pointer. (Distinct from true duplicates, which are
  *merged* via Workflow D.)
- **Workflow G — Ingest from inbox.** Drafts dropped in
  [`../inbox/skills/`](../inbox/README.md) are normalized to this format, checked for
  overlap, then committed here.

## Authoring

Two authorities, no overlap:

- **Format** (frontmatter fields, naming constraints) lives inline in
  [`../templates/SKILL.md.template`](../templates/SKILL.md.template) — start every new
  skill there.
- **Style** (how the `description` and body should read) lives in
  [`../GUIDELINES.md`](../GUIDELINES.md) → *Skills*, with failure modes under
  *Anti-patterns* and a *Validation gate* to check before risky writes.

> [!TIP]
> The `description` is the most load-bearing line: third person, stating **what** the
> skill does and **when** to use it, with the user's likely keywords. See
> [`commit-helper/SKILL.md`](commit-helper/SKILL.md) for a worked example.

