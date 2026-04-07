---
name: arch-research
description: Research a migration task, create a GitHub sub-issue with scope and acceptance criteria, and update the task backlog. Takes a task ID from docs/MIGRATION_TASKS.md, explores the codebase, creates an issue in blockscout/frontend, links it to the parent migration issue, and commits the status update. Use: /arch-research <task-id> (e.g. /arch-research 1-1)
---

You are preparing a migration task for execution by exploring the codebase and producing a well-scoped GitHub issue.

## Prerequisites

Follow the **check-github-cli** skill first to ensure `gh` is available and authenticated.

## Steps

### 1. Find the task

Read `client/MIGRATION_TASKS.md`. Locate the task by the given ID (e.g. `1-1`). Read its **Scope** section.

If the task already has `[~]` or `[x]` status, stop and report that it has already been researched or completed.

Also read:
- `client/ARCH_REDESIGN.md` — conventions and migration map (§2, §4, §6)
- `docs/GLOSSARY.md` — domain terminology

### 2. Explore the codebase

For each source path in the task Scope:

- **Verify the path exists.** If a path is missing, note it — the task description may need correction.
- **Check the destination for conflicts.** Does `client/<target-path>` already contain files that would clash?
- **Classify each file: move or create.** Files that don't yet exist at the destination and aren't in the source need to be created (e.g. a new `types/api.ts` aggregating types from several source files).
- **Flag type extractions.** Look for type definitions or interfaces inside the source files that logically belong to a *different* slice or feature — these must be extracted into the new owner's `types/api.ts` rather than simply moved. Example: a chain-specific sub-type (`arbitrum?`, `scroll?`) embedded in a shared `Transaction` type needs to move to `features/rollup/<type>/types/api.ts`.

### 3. Draft the issue body

```markdown
## Scope

[Exact source → destination file mappings. One line per file or directory.]

## Findings

[Destination conflicts, if any.]
[Files to create rather than move, and what they should contain.]
[Types or interfaces that need extraction — name the type, its current location, and where it belongs after migration.]
[Any other non-obvious work discovered during exploration.]

If no issues were found, write: "No conflicts or extractions identified — straightforward move."

## Acceptance criteria

- [ ] All files moved to target paths per `ARCH_REDESIGN.md §6`
- [ ] All import paths updated repo-wide (no references to old paths remain)
- [ ] Extracted types live in their new slice/feature `types/api.ts`
- [ ] `pnpm lint:tsc` passes
- [ ] `pnpm lint:eslint` clean within `client/` (warnings in legacy paths acceptable)
- [ ] Cross-slice deps left at old paths are explicitly listed in the PR description
```

### 4. Confirm with the user

Before creating anything, present the full draft to the user:

- **Issue title:** `[Migration] <task-id>: <task title>`
- **Issue body:** the complete markdown from step 3

Ask: *"Shall I create this issue? You can request changes before I proceed."*

Wait for explicit confirmation. Apply any requested edits and re-confirm if the changes are significant. Do not proceed to step 5 until the user approves.

### 5. Create the GitHub issue

```bash
gh issue create \
  --repo blockscout/frontend \
  --title "[Migration] <task-id>: <task title>" \
  --body "<issue body from step 4>" \
  --label "Task for agent"
```

Capture the issue number from the output URL (e.g. `https://github.com/blockscout/frontend/issues/42` → number is `42`).

### 6. Link to the parent issue

Get the internal numeric `id` of the new issue (this is different from the issue number):

```bash
gh api repos/blockscout/frontend/issues/<new-issue-number> --jq '.id'
```

Link it as a sub-issue of the parent (parent issue number is in the `client/MIGRATION_TASKS.md` header):

```bash
gh api \
  --method POST \
  repos/blockscout/frontend/issues/<parent-issue-number>/sub_issues \
  --field sub_issue_id=<new-issue-id>
```

### 7. Update client/MIGRATION_TASKS.md

In the task entry, make two changes:
- Change status from `[ ]` to `[~]`
- Append the issue link to the task heading line

Example — before:
```
### 1-1 · [ ] Migrate `client/api/`
```
After:
```
### 1-1 · [~] Migrate `client/api/` · [#42](https://github.com/blockscout/frontend/issues/42)
```

Commit directly to `main`:

```bash
git add client/MIGRATION_TASKS.md
git commit -m "track: 1-1 in progress — blockscout/frontend#42"
git push origin main
```

Replace `1-1` and `42` with the actual task ID and issue number.
