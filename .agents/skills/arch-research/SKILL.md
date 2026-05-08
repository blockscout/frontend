---
name: arch-research
description: Research a migration task, create a GitHub sub-issue with scope and acceptance criteria, and update the task backlog. Takes a task ID from docs/MIGRATION_TASKS.md, explores the codebase, creates an issue in blockscout/frontend, links it to the parent migration issue, and commits the status update.
---

You are preparing a migration task for execution by exploring the codebase and producing a well-scoped GitHub issue.

## Invocation
The skill can **ONLY** be invoked as: `/arch-research <task-id>` (e.g. `/arch-research 1-1`)

## Prerequisites

Follow the **check-github-cli** skill first to ensure `gh` is available and authenticated.

## Steps

### 1. Find the task

Read `client/MIGRATION_TASKS.md`. Locate the task by the given ID (e.g. `1-1`). Read its **Scope** section.

If the task already has `[~]` or `[x]` status, stop and report that it has already been researched or completed.

Also read:
- `client/ARCH_REDESIGN.md` — conventions and migration map (§2, §4, §6)
- `docs/GLOSSARY.md` — domain terminology

### 2. Plan the areas

Do a quick top-level scan of the task Scope and the standard source directories to understand what exists. Then present the user with the list of areas you will cover, in order, with a one-line description of what each contains for this specific task. Skip any area where you found nothing relevant.

**Standard areas (always in this order):**

1. **Types** — `types/api/<entity>*.ts`, `types/client/<entity>*.ts`, `types/views/<entity>*.ts`, and any related param/shared type files
2. **Stubs and mocks** — `stubs/<entity>*.ts`, `mocks/<entity>*.ts`
3. **Hooks, utilities, and contexts** — `lib/hooks/`, `lib/<entity>/`, `lib/contexts/`, and any `utils/` files within `ui/<entity>/`
4. **Shared components** — `ui/shared/entities/<entity>/`, `ui/shared/<entity>/`
5. **Pages** — `ui/pages/<Entity>*.tsx`, `ui/<entity>/` (the detail page and all its tabs, plus any index/list pages)
6. **Feature impact** — all features identified as affected across the previous areas

Present as a short numbered list. For each area, note the rough file count or key directories found. End with: *"I'll work through them one at a time. Let me know if you want to skip or reorder any, otherwise I'll start with Area 1."*

Wait for a go-ahead (or redirect) before proceeding.

### 3. Analyze each area, one at a time

Work through each area in sequence. For each one:

**a. Analyze** — read the relevant files and apply the rules below that apply to this area.

**b. Present a mini-plan** in this format:

```
### Area [N/total]: [Name]

[One sentence describing what this area covers for this task.]

**Plan**
| Source | Destination |
|--------|-------------|
| ...    | ...         |

**Findings**
- [extractions, splits, mixed-concern files, conflicts, or "None."]
```

**c. Wait for explicit approval.** End each area with: *"Any corrections, or shall I move to Area [N+1]: [name]?"*

Apply any corrections. If the changes are significant, re-show the updated mini-plan before proceeding. Do not move to the next area until the user approves the current one.

---

**Rules to apply per area:**

**Types (Area 1)**
- Two strictly separate type layers:
  - `types/api.ts` destination: API/DTO shapes from `types/api/<entity>*.ts`. For each optional field group that maps to a feature (e.g. `celo?`, `arbitrum?`), extract it to `client/features/<name>/types/api.ts`. The slice's own `types/api.ts` composes them via `interface Entity extends FeatureTypeA, FeatureTypeB, ...`.
  - `types/client.ts` destination: frontend-only derived types from `types/client/<entity>*.ts` and `types/views/<entity>*.ts`. Same feature decomposition applies — feature-specific client types go to `client/features/<name>/types/client.ts`. Never mix API shapes and client types in the same file.
- Verify the path exists for each source file; note any missing files.
- Check whether destination `types/api.ts` / `types/client.ts` already exists in `client/` (conflict check).

**Stubs and mocks (Area 2)**
- Identify which stubs entries are feature-specific vs. entity-core. Feature-specific entries go to `client/features/<name>/stubs/<slice>.ts` (named after the slice, not the feature). Slice keeps only entity-core entries.
- Flag any high-fanout stub constants (e.g. `ENTITY_HASH`, `ENTITY_PARAMS`) that are imported across many test files — these require a codemod; note this in Findings.

**Hooks, utilities, and contexts (Area 3)**
- For each hook file: check if it reads `config.features.<featureName>`. If yes → `client/features/<featureName>/hooks/`. If no → `client/slices/<name>/hooks/` (or wherever the slice keeps its hooks).
- `lib/contexts/` scan: look for files whose name contains the entity name. Destination is `client/slices/<name>/contexts/` or `client/features/<name>/contexts/` — a dedicated sub-folder, not the root.
- Mixed-concern utility files: open any `utils.ts` in scope and check if it mixes logic from different domains. If yes, split rather than move; list what each new file should contain.

**Shared components (Area 4)**
- `ui/shared/` sweep: search for components whose filename begins with the slice entity prefix. These are slice-owned components that ended up in the shared bucket.
- For each component file with a sibling `.pw.tsx` or `__screenshots__/` directory, include those siblings in the mapping.
- Classify each component: core slice → `client/slices/<name>/components/`; feature/chain-specific → `client/features/<chain-or-feature>/components/`.

**Pages (Area 5)**
- `ui/pages/` sweep: search for page components whose filename begins with the entity prefix. **Also** scan the Next.js `pages/` directory for entries that `dynamic(() => import('ui/pages/<Name>'))` a component related to the entity — page filenames may not match the route (e.g. `Accounts.tsx` → `/accounts`).
- For a tabbed detail page, each tab becomes a named sub-folder under `pages/details/` (e.g. `info/`, `txs/`, `token-transfers/`). Feature-owned tab components go to `client/features/<name>/pages/<slice>/` — never as sub-folders inside the slice's `pages/` tree.
- For index/list pages, all related list-item and table components go flat into `pages/index/`.
- Include `.pw.tsx` siblings and `__screenshots__/` directories for every page component.
- For each Next.js entry file, note the import path update required (the entry file itself stays in `pages/`).

**Feature impact (Area 6)**
- Compile all features identified in Areas 1–5.
- For each feature, list: feature path, files to create or merge (`types/api.ts`, `types/client.ts`, `stubs/<slice>.ts`, page components), and what each file should contain.
- If no features are affected, state that explicitly.

### 4. Compile and confirm

Once all areas are approved, assemble the full issue body:

```markdown
## Scope

[All approved source → destination file mappings, organised by slice and feature. One mapping table per section.]

## Feature impact

[For each affected feature:
  - Feature path
  - Files to create or merge, and what they should contain
If none: "No feature-side files required."]

## Findings

[All Findings from the individual areas, consolidated. Remove duplicates.]

If nothing non-obvious was found: "No conflicts or extractions identified — straightforward move."

## Files to delete

[Flat list of every source path that must be removed once its contents have been moved. Use a folder path when the entire folder moves; list individual files only when part of the folder stays. Paths that stay in place (e.g. Next.js `pages/` entry files) must NOT appear here.]

## Acceptance criteria

- [ ] All files moved to target paths per `ARCH_REDESIGN.md §6`
- [ ] All import paths updated repo-wide (no references to old paths remain)
- [ ] Extracted API types live in their new slice/feature `types/api.ts`
- [ ] Extracted client/UI types live in their new slice/feature `types/client.ts`
- [ ] `pnpm lint:tsc` passes
- [ ] `pnpm lint:eslint:fix` clean within `client/` (warnings in legacy paths acceptable)
- [ ] All source files/folders deleted from old paths (none remain)
- [ ] Cross-slice deps left at old paths are explicitly listed in the PR description
```

Present the full draft with the issue title (`[Migration] <task-id>: <task title>`) and ask: *"Shall I create this issue? You can request changes before I proceed."*

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
