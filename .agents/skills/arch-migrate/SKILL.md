---
name: arch-migrate
description: Execute a migration task from a GitHub issue through to a PR, or fix unresolved review comments on an existing migration PR. Reads scope and acceptance criteria from the issue body.
---

You are executing a step of the Blockscout frontend client architecture migration.

## Invocation
The skill can **ONLY** be invoked as: `/arch-migrate <issue-number> ("execute" mode)` or `/arch-migrate fix <pr-number> ("fix review comments" mode)`.

## GitHub tool selection

Use whichever GitHub access method is available in your environment — in order of preference:

1. **`gh` CLI** — if available and authenticated (`gh auth status` succeeds), use it for all GitHub operations.
2. **GitHub MCP server tools** — if `gh` is unavailable, use the MCP tools provided by the GitHub MCP server.
3. **REST API via `curl`** — if neither above is available, use the GitHub REST API directly with `curl` and a `GITHUB_TOKEN` env var.

Detect availability once at the start and stick with that method throughout. Do not mix methods.

## Mode

**Execute** (`/arch-migrate <issue>`): fetch the GitHub issue and execute the migration through to a PR.

**Fix** (`/arch-migrate fix <pr>`): address unresolved review comments on an existing PR.

---

## Execute mode

### 1. Read context

Fetch the issue body from `blockscout/frontend` using the available GitHub tool. The issue number is the argument passed to the skill.

Also read:
- `client/ARCH_REDESIGN.md` — naming conventions (§2), dependency rules (§8), execution rules (§10)
- `docs/GLOSSARY.md` — domain terminology

The issue body contains the **Scope**, **Findings**, and **Acceptance criteria** for this task. That is your working spec.

### 2. Explore before touching
Read all source files listed in the issue **Scope**. Understand what they export and what tests exist.

### 3. Move and delete files
- Destination comes from the issue Scope and `ARCH_REDESIGN.md §6` migration map.
- Rename files to kebab-case **at move time** — no separate rename PR.
- Component files stay PascalCase. Hook files stay `useCamelCase.ts`. Everything else: kebab-case.
- Extract types/interfaces flagged in the issue **Findings** section into their new homes.
- **After writing each file at its destination, delete the source.** Use the `## Files to delete` list in the issue as your checklist — work through it item by item. If an entry is a folder, delete the entire folder (`rm -rf`). If an entry is a file, delete that file.
- **Verify deletions before moving on.** Once all moves are done, check that every path listed under `## Files to delete` is gone. For any that still exist, delete them now.

### 4. Update all imports in the same PR
- Update every import path across the entire repo.
- For high-fanout files, write a codemod script, run it, then **delete the script** — do not commit it to the repo. Commit only the resulting file changes.
- No re-export shims. No long-lived compatibility aliases.

### 5. Run checks
```
pnpm lint:tsc           # must pass
pnpm lint:eslint:fix    # must pass
```

Fix errors if any (warnings are acceptable).

### 6. Cross-slice dependencies left at old paths
If a dependency is not yet migrated, leave its import at the old path and list it explicitly in the PR description as a follow-up for the relevant future task.

### 7. Branch and PR

- Extract the task ID from the issue title (format: `[Migration] <task-id>: ...`).
- Branch name: `migration/<task-id>-<short-slug>` (e.g. `migration/1-1-client-api`)
- Branch from `main`.
- PR title: `[Migration <task-id>] <task title>`
- PR targets `main`.
- Create the PR using the available GitHub tool (see **GitHub tool selection** above).
- PR body must include:
  - `Closes #<issue-number>` — on the first line, so GitHub auto-closes the issue on merge
  - What moved and where
  - Any codemods run (include the command / script body used, but do not commit the script itself)
  - Cross-slice deps left at legacy paths (list file + old import path)
  - Checklist: `pnpm lint:tsc` passing, `pnpm lint:eslint` clean within `client/`, all source files/folders deleted from old paths
- PR labels: `refactoring`

---

## Fix mode

`/arch-migrate fix <pr>` — address unresolved review comments only.

1. Fetch unresolved review threads for the PR from `blockscout/frontend` using the available GitHub tool. If using `gh`:

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

If using the GitHub MCP server, call `list_review_comments_on_pull_request` (for inline comments) and `get_pull_request_reviews` (for review-level comments), then filter to unresolved threads manually. If using the REST API, `GET /repos/blockscout/frontend/pulls/<pr>/comments` returns inline comments; filter by `in_reply_to_id` to group threads.

Keep only threads where `isResolved: false`. Skip everything else — the reviewer marks threads resolved when they are no longer relevant.

2. Address each unresolved thread. Push fixes to the existing branch.
3. Summarise which threads were addressed and what changed.
