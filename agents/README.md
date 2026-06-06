# 🤖 Agents — the subagent catalog

This folder holds the package's **subagents**: focused specialists the main agent
delegates work to. It is one half of the skills/agents factory described in the root
[`README.md`](../README.md) and [`CLAUDE.md`](../CLAUDE.md); for skills, see
[`../skills/README.md`](../skills/README.md).

A subagent is a single `.md` file whose **body is a system prompt** and whose
frontmatter declares how to run it. It runs in its own isolated context — it cannot
see this conversation, and it returns only a final result. The main agent decides
**when** to hand off by reading each agent's `description`; that field is the routing
signal, so it must be precise.

## Catalog

| Subagent | Description | Tools | Model |
|----------|-------------|-------|-------|
| [`code-reviewer`](code-reviewer.md) | Code-review specialist; use proactively right after writing or changing code to check quality, security, and maintainability. | Read, Grep, Glob, Bash | sonnet |

## Anatomy of a subagent

```
agent-name.md
├── frontmatter   # name, description, tools, model (+ optional fields)
└── body          # the system prompt: role, when-invoked, constraints, output
```

The essentials, at a pointer level — the template documents every field inline:

- **`name`** — equals the file name; lowercase, hyphens, numbers.
- **`description`** — what it does and **when** to use it. This is what the main
  agent routes on, so make it action-oriented (e.g. "Use proactively right
  after...").
- **`tools`** — **least privilege**: grant only what the agent needs; omit only if
  it genuinely needs all of them.
- **`model`** — defaults to `sonnet`; `haiku` for cheap/narrow work, `opus` for hard
  reasoning (the template lists all values, incl. `inherit`).

Typical body sections: `## When you are invoked`, `## Constraints`, `## Output`, plus
a `## What to check` when the checks warrant it (see [`code-reviewer.md`](code-reviewer.md)).

Each agent should also carry **trigger examples** — a few *should delegate here*
prompts and 1–2 *should NOT* (see the template's `## Trigger examples`); they feed
the Workflow F description check.

> [!IMPORTANT]
> Routing happens by **description**, not by body text. A "consult agent X" pointer
> in another agent's body is inert — a subagent cannot invoke another subagent.

For the field reference start from [`../templates/agent.md.template`](../templates/agent.md.template);
for style and the field-by-field rules see the **Agents** section of
[`../GUIDELINES.md`](../GUIDELINES.md).

## How agents are created, updated, and disambiguated

The full workflow definitions live in [`CLAUDE.md`](../CLAUDE.md); here is how they
apply to this folder.

- **Create (Workflow A).** Copy the template into `agents/<name>.md`, fill it in per
  `GUIDELINES.md`, add a row to the catalog above.
- **Update (Workflow C).** Re-read `GUIDELINES.md` (it may have moved on), apply the
  change plus any guideline the file no longer satisfies, and keep the catalog row
  and `description` in sync.
- **Disambiguate (Workflow F).** When a new agent overlaps an existing one, draw the
  scope boundary in the **`description` fields** — the general agent narrows its
  scope and defers ("...; for &lt;case&gt;, the `X` agent is preferred"), the specific
  agent owns its case. If they do the same job, merge instead (Workflow D).

> [!NOTE]
> This is the key contrast with skills. Skills resolve overlap with **in-body
> pointers** that cascade through a tree (Workflow E). Agents can't read each other,
> so their disambiguation lives entirely in descriptions — and updates apply
> **broadly**, across all affected agents in one pass.

