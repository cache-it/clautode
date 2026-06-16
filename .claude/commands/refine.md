---
description: Reorganize and cascade the skill and agent catalog in-place (Workflow J)
---

The user wants to **refine the skill and agent catalog**. Execute **Workflow J**
defined in [`CLAUDE.md`](../../CLAUDE.md) — that file is the single source for the
protocol's steps; do not restate them here, follow them there.

1. First **read `CLAUDE.md` and `GUIDELINES.md`** to acquire the project's knowledge.
2. Run Workflow J exactly as written there:
   - Full Workflow E pass over all skills (hierarchy, one at a time with confirmation).
   - Full Workflow F pass over all agents (description disambiguation, in one pass).
   - Purge stale source artifacts from `inbox/` and `references/` subdirectories.
   - Update `skills/README.md` and `agents/README.md`.
3. **Report** what was refactored, tightened, and deleted, and anything pending a user decision.
