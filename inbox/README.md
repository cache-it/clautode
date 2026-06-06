# 📥 inbox — staging area for ingestion

This is the **drop zone** of the [factory](../CLAUDE.md): leave raw drafts or source
docs for a **new skill or agent** here, then ask Claude to *ingest the inbox*. Claude
turns each item into a proper, guideline-conforming unit and files it under
[`skills/`](../skills/README.md) or [`agents/`](../agents/README.md). It is one of two intake paths —
the other is creating a unit by hand (see [By hand](#by-hand-workflow-a-contrast)).

## How ingestion works (Workflow G)

When you ask Claude to ingest, it runs **Workflow G** in
[`../CLAUDE.md`](../CLAUDE.md) end to end:

1. **Scan** every item under `inbox/skills/` and `inbox/agents/` — each is treated as
   a draft or source material, not necessarily final format.
2. **Normalize** each into a proper `SKILL.md` / agent `.md` that follows
   [`../templates/`](../templates/) and every relevant rule in
   [`../GUIDELINES.md`](../GUIDELINES.md) (including a synthesized `description`).
3. **Integrate** into the existing structure before writing anything final —
   deduplicate (**Workflow D**), place skills in the specialization hierarchy
   (**Workflow E**), disambiguate agent descriptions (**Workflow F**).
4. **Confirm conflicts with you.** If a draft collides with, duplicates, or
   specializes an existing unit, Claude presents the situation and proposed
   resolution and waits — never silently overwriting.
5. **Write** the finalized files to `skills/<name>/SKILL.md` / `agents/<name>.md` and
   update the relevant catalog `README.md`.
6. **Clean up** — delete the ingested source file(s) from here once placed.
7. **Report** what was created, merged, specialized, and deleted, plus anything left
   pending a decision.

> [!IMPORTANT]
> **Safety rule:** a source file is deleted only **after** its destination exists and
> any conflict has been confirmed. If ingestion of an item is aborted, its source
> stays in `inbox/`.

## Structure

```
inbox/
├── skills/   # drafts/docs for new skills, awaiting ingestion
└── agents/   # drafts/docs for new agents, awaiting ingestion
```

Both subfolders are **transient**: anything dropped here is meant to be ingested and
removed, so the directories are normally empty. The `.gitkeep` files keep them
tracked in git when empty — leave them in place.

## By hand (Workflow A contrast)

Ingestion is for raw drafts that still need normalizing. To author a unit **directly**
instead, skip the inbox and follow **Workflow A**: copy a template from
[`../templates/`](../templates/) into `skills/<name>/SKILL.md` or `agents/<name>.md`,
fill it in against [`../GUIDELINES.md`](../GUIDELINES.md), then register it in the
catalog. Same destination and structure rules (D/E/F) — just no staging step.

