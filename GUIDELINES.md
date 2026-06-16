# GUIDELINES.md — how I want skills and agents written

This file is the **single source of truth** for my personal preferences when
authoring Claude Code skills and subagents. Claude reads it (via
[`CLAUDE.md`](CLAUDE.md)) before creating or updating any file, and keeps it up to
date as my preferences evolve (Workflow B in `CLAUDE.md`).

> These are **preferences**, not platform facts. The factual format notes (what
> fields exist, naming constraints) live inline in the [`templates/`](templates/).
>
> The entries below are sensible defaults to start from — **edit them freely**.
> Each `- ` line is one preference; keep them short and declarative.

## Cross-cutting

- Language of all authored content: **English**.
- Naming: lowercase-with-hyphens; the name should describe the activity.
- One unit = one responsibility. Prefer several small, focused skills/agents over
  one large catch-all.
- No near-duplicates: avoid two units that do nearly the same thing under
  different names. On alignment (repo → local), merge them into one (see `CLAUDE.md`
  Workflow D).
- Descriptions (both frontmatter and catalog entries) are **intelligently
  synthesized**: as short as possible, no filler or redundancy, while keeping the
  keywords that trigger activation/delegation.
- Never hardcode secrets or tokens.
- Keep the relevant `README.md` catalog updated whenever a unit is added or removed.
- Give each unit a few **trigger examples** — 2–3 prompts that *should* activate it and
  1–2 that should *not*. They document intent and feed the overlap/collision checks in
  Workflows E/F; they are not a guarantee the unit will fire at runtime.
- **No source filename references.** Generated skill and agent files must never mention
  the name of the file, draft, or document they were authored from. The content
  describes only the theme the unit serves and how to activate it.
- **Delete source artifacts after use.** Any reference file, draft, or raw document
  used to create or define a unit must be deleted once the finalized output file is
  written and verified. Never leave input artifacts alongside the output they produced.

## Skills

- `description`: third person, states **what** it does and **when** to use it, and
  includes the user's likely keywords/actions. Intelligently synthesized — the
  shortest phrasing that still triggers reliably; specific, not vague, no filler.
- Body: concise. If instructions exceed roughly **40 lines** or are not always
  needed, move the detail into `references/` and load it on demand.
- Use `scripts/` for anything that must run deterministically the same way every
  time, instead of describing it in prose.
- Default invocation: both automatic and manual (`/name`). Set
  `disable-model-invocation: true` only when the skill should never auto-trigger.
- Typical body sections (adapt as needed): `## When to use it`, `## Procedure`, then
  any of `## Notes` / `## Example` / domain-specific sections.
- Always end with a concrete example when it aids clarity.
- **Specialization hierarchy.** Skills form a tree of categories/subcategories.
  When a more specific skill exists, a more general one must not duplicate it:
  strip the overlapping part and add a "for <case>, use skill A" pointer. This
  cascades through the chain so coverage is never duplicated. (Distinct from
  near-duplicates, which are *merged* — see `CLAUDE.md` Workflows D and E.)

## Agents

- `tools`: least privilege — grant only the tools the agent actually needs; omit
  the field only when it genuinely needs all of them.
- `model`: default to `sonnet`; use `haiku` for cheap/fast narrow tasks and `opus`
  only for hard reasoning. State the choice rationale implicitly via the task.
- `description`: action-oriented ("Use proactively...", "Use right after...") to
  encourage automatic delegation. Intelligently synthesized — concise, no filler,
  while keeping the delegation triggers.
- Typical system-prompt sections (adapt as needed): `## When you are invoked` (with
  task steps), `## Constraints`, `## Output`; add a `## What to check` heading when the
  checks warrant it (see the `code-reviewer` example).
- The agent should **not** do more than its remit — define explicit constraints
  for what it must NOT do.
- Output: structured and prioritized; tell the agent exactly how to format what it
  returns to the main agent.
- **Disambiguation by description.** Agents are routed by their `description`, not
  by reading each other. When a new agent specializes a more general one, draw the
  scope boundary in the `description` fields (B defers to A for the specific case;
  A owns it) — never a body pointer. Same job → merge instead. (See `CLAUDE.md`
  Workflow F; contrast with the skill hierarchy in Workflow E.)

## Anti-patterns (do not author)

Failure modes worth naming explicitly. Each pair is **BAD → GOOD**; cases already
ruled out elsewhere are cross-referenced, not repeated.

- **Vague description.** BAD: "helps with git." → GOOD: "Writes Conventional Commits
  from staged changes; use when the user asks to commit or mentions staged changes."
- **Catch-all unit.** BAD: one `dev-helper` skill that commits, reviews, and releases.
  → GOOD: several single-responsibility units, one job each.
- **Competing descriptions.** BAD: two units whose descriptions both claim to "review
  code." → GOOD: one narrows its scope and defers to the other (skills: a Workflow E
  pointer; agents: a description boundary, Workflow F).
- **Over-broad agent tools.** BAD: granting an agent all tools "to be safe." → GOOD:
  list only the tools it actually needs (least privilege).
- Other failure modes are owned elsewhere — secrets, near-duplicates, agent
  body-pointers, remit-creep: see **Cross-cutting**, **Agents**, and Workflows D/E/F.

## Validation gate

Before writing a unit to a risky destination — ingesting from `inbox/` (Workflow G) or
merging into `~/.claude` (Alignment protocol) — check it against this gate. Each item
**references** its authority instead of restating it, so the gate never drifts.

Every unit:
- `name` matches the regex/length in the relevant template and equals the file/folder name.
- Frontmatter uses only the keys listed in that template.
- `description` follows **Skills**/**Agents** above and trips none of the **Anti-patterns**.
- No hardcoded secrets (`CLAUDE.md` Rules of engagement).
- No source filename references anywhere in the file body or frontmatter (see **Cross-cutting**).
- Exactly one catalog row in the folder's `README.md`, linking to the file.
- Trigger examples present, or deliberately omitted.

Skills also: body within ~40 lines (or detail moved to `references/`); uses the typical sections or a sensible adaptation.
Agents also: tools are least-privilege; `model` defaults to `sonnet` unless justified.

Mandatory at the risky boundaries (Workflow G, alignment); a light self-check elsewhere —
not closing ceremony on every hand edit.

## Notes on changing these preferences

When I state a new preference during any session, Claude should:
1. Add/amend the matching entry above (replace, don't duplicate).
2. Propagate per `CLAUDE.md` Workflow B — agents broadly, skills one at a time.
