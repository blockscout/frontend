# 01 — Release tool scaffold, category mapping and the `check-pr` PR gate

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3747 |
| Blocked by | none |

## What to build

The `tools/release/` module exists in the repo's `tools/<name>/` shape and its first subcommand works
end to end: `check-pr <number>` validates a pull request against `docs/PULL_REQUEST_TEMPLATE.md` and the
category-label rules, and a new `pull_request` workflow runs it on every PR event that can change the
verdict (opened, edited, synchronize, labeled, unlabeled, ready_for_review). The section ↔ label mapping
that every later subcommand reads is created here as the single source of truth. The `backport` and
`release` labels exist in the repository.

## Acceptance criteria

How to verify: open the task's draft PR; the new check appears and reflects its body and labels.

- [ ] `tools/release/` has `run.sh`, `tsconfig.json`, `index.ts` (CLI dispatch), co-located `*.spec.ts`,
      a `/tools/release/dist/` `.gitignore` entry, and is type-checked by `pnpm lint:tsc`, linted by ESLint,
      measured by the complexity gate and run by Vitest, matching `tools/doc-links/`.
- [ ] A `github.ts` I/O layer wraps `gh api` (and `gh` subcommands) with the `tools/cli/exec.ts` buffer
      limit; it reads `GH_TOKEN` in CI and the operator's `gh` auth locally. No new npm dependency.
- [ ] A `categories.ts` module exports the ordered section ↔ label table (New Features: `feature`,
      `enhancement`, `client feature`; Bug Fixes: `bug`; Performance Improvements: `performance`;
      Dependencies Updates: `dependencies`; Design Updates: `design`; DX & Tooling: `refactoring`; Other
      Changes: `chore`) and the derived allowed-category set.
- [ ] Pure `checkPr(body, labels, template)` returns the list of failures: missing template heading, leftover
      placeholder text, no category label, more than one category label, `dependencies` combined with another
      category. A `release` label short-circuits to no failures. Specs cover every rule and the exemption.
- [ ] `check-pr <number>` fetches body and labels, prints the failures and exits non-zero on any.
- [ ] `.github/workflows/pull-request-check.yml` runs on the events above with `pull-requests: read`, and
      is checkout + pnpm install + one CLI call. Drafts are not skipped.
- [ ] Labels `backport` ("Ship in the current patch line") and `release` ("Release PRs; exempt from the PR
      check") exist on the repository.
- [ ] `(human)` The check runs on this task's PR and its verdict matches the PR's body and labels.

## Details

- Template headings are read from `docs/PULL_REQUEST_TEMPLATE.md` at run time, never copied. Placeholder
  text is the italic `*[…]*` lines of the template.
- Argument parsing reuses `tools/cli/flags.ts`; the first positional is the subcommand.
- The workflow fetches the PR body by number through the CLI, not from the event payload, so an `edited`
  event sees the saved body.

## Leaf worklist

- [ ] 1 `[agent]` Scaffold `tools/release/` (run.sh, tsconfig, dispatch, gitignore, `pnpm release` script) and the `gh`-backed I/O layer
- [ ] 2 `[agent]` `categories.ts` mapping + spec
- [ ] 3 `[agent]` Pure `checkPr` + specs, `check-pr` subcommand
- [ ] 4 `[agent]` `pull-request-check.yml` workflow
- [ ] 5 `[agent]` Create the `backport` and `release` labels with `gh label create`
