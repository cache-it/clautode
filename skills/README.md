# Skills

Catalog of skills. Each skill is a folder containing at least a `SKILL.md`.

| Skill | Description | Invocation |
|-------|-------------|------------|
| [`commit-helper`](commit-helper/SKILL.md) | Writes Conventional Commits messages from staged changes. | automatic + `/commit-helper` |

## Structure of a skill

```
skill-name/
├── SKILL.md        # required: YAML frontmatter + markdown instructions
├── scripts/        # optional: executable scripts (e.g. Python/Bash)
└── references/     # optional: docs/examples loaded only when needed
```

Minimal `SKILL.md`:

```markdown
---
name: skill-name
description: What it does and WHEN to use it. This text decides automatic activation.
---

# Skill Name

Instructions Claude follows when the skill is invoked.
```

See [`../templates/SKILL.md.template`](../templates/SKILL.md.template) to get started —
it documents naming and frontmatter fields inline — and [`../GUIDELINES.md`](../GUIDELINES.md)
for style.
