---
name: migrate
description: Execute the next architecture migration task through to a PR, or fix review comments on an existing migration PR. Follows the blueprint in client/ARCH_REDESIGN.md and the task backlog in docs/MIGRATION_TASKS.md. Use for /migrate (start next task), /migrate <task-id> (start a specific task), or /migrate fix <pr> (address review comments).
---

You are executing a step of the Blockscout frontend client architecture migration.

## Context to read before any work

1. `docs/MIGRATION_TASKS.md` — task backlog; find the task to work on (see Mode below)
2. `client/ARCH_REDESIGN.md` — naming conventions (§2), directory layout (§4), migration map (§6), dependency rules (§8), execution rules (§10)
3. `docs/GLOSSARY.md` — domain terminology (consult when you encounter an unfamiliar feature or entity name)

## Mode

**No arguments** (`/migrate`): find the first task in `docs/MIGRATION_TASKS.md` with status `[ ]`. That is the task to execute.

**Task ID given** (e.g. `/migrate 2-1`): execute that specific task.

**Fix mode** (e.g. `/migrate fix 42` or `/migrate fix https://github.com/.../pull/42`): address open review comments on that PR.
- Fetch review threads via `gh api graphql` and filter to threads where `isResolved: false` only.
- Do not touch threads already marked as resolved — the reviewer resolves threads that are no longer relevant.
- Address each unresolved comment, push the fixes to the existing branch, and summarise which threads were resolved.

## Executing a migration task

### 1. Explore before touching
Read all source files listed in the task's **Scope**. Understand what they export, who imports them (grep for their current import paths repo-wide), and what tests exist.

### 2. Move files
- Destination comes from `ARCH_REDESIGN.md §6` migration map.
- Rename files to kebab-case **at move time** — no separate rename PR.
- Component files stay PascalCase. Hook files stay `useCamelCase.ts`. Everything else: kebab-case.

### 3. Update all imports in the same PR
- Update every import path across the entire repo.
- For high-fanout files (many importers), use a codemod script as a dedicated commit within the branch.
- No re-export shims. No long-lived compatibility aliases.

### 4. Verify dependency rules
- `client/api` must not have runtime imports from `client/slices/*` or `client/features/*`. `import type` is allowed.
- No new import cycles within `client/`. Run `pnpm lint:eslint` and fix all errors inside `client/`.
- Warnings in legacy `lib/` and `ui/` paths are expected and do not block the PR.

### 5. Run checks
```
pnpm lint:tsc      # must pass
pnpm lint:eslint   # must pass within client/; legacy warnings acceptable
```

### 6. Cross-slice dependencies left at old paths
If a dependency (e.g. rollup types, address types) is not yet migrated, **leave its import at the old `lib/` path** and list it explicitly in the PR description as a follow-up item for the relevant future task.

## Branch and PR

- Branch name: `migration/<task-id>-<short-slug>` (e.g. `migration/2-1-tx-slice`)
- Branch from `main`.
- PR title: `[Migration <task-id>] <task title>` (e.g. `[Migration 2-1] Pilot: migrate slices/tx end-to-end`)
- PR targets `main`.
- PR body must include:
  - What moved and where
  - Any codemods run (include the script or command used)
  - Cross-slice / cross-feature deps left at legacy paths (list file + import path)
  - Checklist: `pnpm lint:tsc` passing, `pnpm lint:eslint` clean within `client/`

## After opening the PR

Update `docs/MIGRATION_TASKS.md` on the migration branch:
- Change task status from `[ ]` to `[~]`.
- Fill in the PR link.

## After the PR is merged (human step)

The reviewer (human) changes `[~]` → `[x]` in `docs/MIGRATION_TASKS.md` and merges. No further agent action needed unless review comments require fixes.
