# Agents (Subagents)

Catalog of subagents. Each subagent is a single `.md` file.

| Subagent | Description | Tools | Model |
|----------|-------------|-------|-------|
| [`code-reviewer`](code-reviewer.md) | Reviews changed code for quality, security, and maintainability. | Read, Grep, Glob, Bash | sonnet |

## Structure of a subagent

A `agent-name.md` file with YAML frontmatter + body (which acts as the system prompt):

```markdown
---
name: agent-name
description: What it does and WHEN to use it. Action-oriented phrasing ("Use proactively...")
  encourages automatic delegation.
tools: Read, Grep, Glob, Bash   # optional: if omitted, inherits all tools
model: sonnet                   # optional: haiku | sonnet | opus | inherit
---

You are an assistant specialized in...
Describe the role, procedure, and constraints.
```

See [`../templates/agent.md.template`](../templates/agent.md.template) to get started —
it documents the fields inline, and [`../GUIDELINES.md`](../GUIDELINES.md) for style.
