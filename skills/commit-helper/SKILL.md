---
name: commit-helper
description: Writes Conventional Commits messages from staged changes. Use when the user asks to commit, write a commit message, or mentions staged git changes.
---

# Commit Helper

Helps write clear and consistent commit messages following the
[Conventional Commits](https://www.conventionalcommits.org/) convention.

## When to use it

- The user asks to commit or to write a commit message.
- There are staged changes to describe.

## Procedure

1. Run `git diff --staged` to see what is staged.
   - If nothing is staged, warn the user and stop.
2. Group the changes by intent (feature, fix, refactor, docs, test, chore).
3. Propose a message in the format:

   ```
   <type>(<optional scope>): <short summary, imperative, ≤ 72 characters>

   <optional body: what and why, not how>
   ```

4. Show the proposed message and ask for confirmation before committing.
   Do not run `git commit` until the user approves.

## Allowed types

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Example

```
feat(auth): add JWT token refresh

The client now automatically renews the token on expiry,
avoiding forced logout during long sessions.
```

## Trigger examples

- Should trigger: "commit this", "write a commit message", "stage and commit".
- Should trigger: "I've staged my changes — what's a good message?"
- Should NOT trigger: "explain what Conventional Commits are" (a question, not a request to commit).
