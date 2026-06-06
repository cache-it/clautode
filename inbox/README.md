# inbox — staging area for ingestion

Drop raw drafts or documentation for a **new skill or agent** here, then ask Claude
to *ingest the inbox*. Claude follows **Workflow G** in [`../CLAUDE.md`](../CLAUDE.md):

1. Reads every item under `inbox/skills/` and `inbox/agents/`.
2. Turns each into a proper file following `templates/` and `../GUIDELINES.md`.
3. Runs the hierarchy/dedup logic (Workflows D, E, F) and **checks conflicts with
   you** before writing.
4. Writes the finalized files into the standard locations (`skills/`, `agents/`).
5. **Deletes the ingested source files from here** once they are correctly placed.

```
inbox/
├── skills/   # drafts/docs for new skills, awaiting ingestion
└── agents/   # drafts/docs for new agents, awaiting ingestion
```

> Contents here are **transient**: anything in `inbox/` is meant to be ingested and
> removed. To add a unit by hand instead, create it directly under `skills/` or
> `agents/` (Workflow A).
