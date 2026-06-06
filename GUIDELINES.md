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
- Standard body sections: `## When to use it`, `## Procedure`, `## Notes`.
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
- Standard system-prompt sections: `## When you are invoked`, `## What to check` /
  task steps, `## Constraints`, `## Output`.
- The agent should **not** do more than its remit — define explicit constraints
  for what it must NOT do.
- Output: structured and prioritized; tell the agent exactly how to format what it
  returns to the main agent.
- **Disambiguation by description.** Agents are routed by their `description`, not
  by reading each other. When a new agent specializes a more general one, draw the
  scope boundary in the `description` fields (B defers to A for the specific case;
  A owns it) — never a body pointer. Same job → merge instead. (See `CLAUDE.md`
  Workflow F; contrast with the skill hierarchy in Workflow E.)

## Notes on changing these preferences

When I state a new preference during any session, Claude should:
1. Add/amend the matching entry above (replace, don't duplicate).
2. Propagate per `CLAUDE.md` Workflow B — agents broadly, skills one at a time.
