---
name: arch-migrate
description: Execute a migration task from a GitHub issue through to a PR, or fix unresolved review comments on an existing migration PR. Reads scope and acceptance criteria from the issue body. Use: /arch-migrate <issue-number> (execute) or /arch-migrate fix <pr-number> (fix review comments).
---

You are executing a step of the Blockscout frontend client architecture migration.

## Prerequisites

Follow the **check-github-cli** skill first to ensure `gh` is available and authenticated.

## Mode

**Execute** (`/arch-migrate <issue>`): fetch the GitHub issue and execute the migration through to a PR.

**Fix** (`/arch-migrate fix <pr>`): address unresolved review comments on an existing PR.

---

## Execute mode

### 1. Read context

```bash
gh issue view <issue> --repo blockscout/frontend
```

Also read:
- `client/ARCH_REDESIGN.md` — naming conventions (§2), dependency rules (§8), execution rules (§10)
- `docs/GLOSSARY.md` — domain terminology

The issue body contains the **Scope**, **Findings**, and **Acceptance criteria** for this task. That is your working spec.

### 2. Explore before touching
Read all source files listed in the issue **Scope**. Understand what they export and what tests exist.

### 3. Move files
- Destination comes from the issue Scope and `ARCH_REDESIGN.md §6` migration map.
- Rename files to kebab-case **at move time** — no separate rename PR.
- Component files stay PascalCase. Hook files stay `useCamelCase.ts`. Everything else: kebab-case.
- Extract types/interfaces flagged in the issue **Findings** section into their new `types/api.ts` homes.

### 4. Update all imports in the same PR
- Update every import path across the entire repo.
- For high-fanout files, use a codemod script as a dedicated commit within the branch.
- No re-export shims. No long-lived compatibility aliases.

### 5. Verify dependency rules
- `client/api` must not have runtime imports from `client/slices/*` or `client/features/*`. `import type` is allowed.
- No new import cycles within `client/`. Fix all ESLint errors inside `client/`.
- Warnings in legacy `lib/` and `ui/` paths are expected and do not block the PR.

### 6. Run checks
```
pnpm lint:tsc      # must pass
pnpm lint:eslint   # must pass within client/; legacy warnings acceptable
```

### 7. Cross-slice dependencies left at old paths
If a dependency is not yet migrated, leave its import at the old path and list it explicitly in the PR description as a follow-up for the relevant future task.

## Branch and PR

- Extract the task ID from the issue title (format: `[Migration] <task-id>: ...`).
- Branch name: `migration/<task-id>-<short-slug>` (e.g. `migration/1-1-client-api`)
- Branch from `main`.
- PR title: `[Migration <task-id>] <task title>`
- PR targets `main`.
- PR body must include:
  - `Closes #<issue-number>` — on the first line, so GitHub auto-closes the issue on merge
  - What moved and where
  - Any codemods run (include the script or command used)
  - Cross-slice deps left at legacy paths (list file + old import path)
  - Checklist: `pnpm lint:tsc` passing, `pnpm lint:eslint` clean within `client/`

---

## Fix mode

`/arch-migrate fix <pr>` — address unresolved review comments only.

1. Fetch review threads, filtering to unresolved only:

```bash
gh api graphql -f query='
{
  repository(owner: "blockscout", name: "frontend") {
    pullRequest(number: <pr>) {
      reviewThreads(first: 50) {
        nodes {
          isResolved
          path
          line
          comments(first: 5) {
            nodes { body author { login } }
          }
        }
      }
    }
  }
}'
```

Keep only threads where `isResolved: false`. Skip everything else — the reviewer marks threads resolved when they are no longer relevant.

2. Address each unresolved thread. Push fixes to the existing branch.
3. Summarise which threads were addressed and what changed.
