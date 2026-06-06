---
tags: [meta]
---

# Documentation guidelines — this project

How Claude should turn the raw material in `inbox/` into organized, Obsidian-ready
notes in `notes/`. These are sensible defaults — **edit them per project**. Claude
reads this file before organizing (Workflow I in the repo's `CLAUDE.md`).

## Goal

A connected **second brain**: atomic, linked Markdown notes, all navigable from
`index.md`. Favor understanding over archiving — restructure the source, don't just
copy it.

## Note conventions

- **One concept per note.** Split large source docs into several atomic notes.
- **File name:** kebab-case, descriptive (e.g. `retrieval-augmented-generation.md`).
- **Frontmatter:** Obsidian YAML with `tags` and optional `aliases`.
- **Links:** connect related notes with `[[wikilinks]]`. No orphans — every note must
  be reachable from `index.md` (directly or via another note).
- **Length:** short and self-contained; link out instead of repeating.
- **Source line:** end each note with a `Source:` pointer to the originating inbox
  file, so a claim can be traced back.

## Structure

- `notes/` holds the notes (group into topic subfolders once they grow).
- `index.md` is the MOC: the curated map linking the main notes/topics.

## Tags & naming

- Use a small, consistent tag vocabulary (e.g. `#concept`, `#decision`, `#reference`).
- Keep titles human-readable; rely on aliases for synonyms.

## Ingestion behavior

- After producing notes, **move** the processed files from `inbox/` to `_archive/`
  (non-destructive). Confirm before archiving; never delete source material.
