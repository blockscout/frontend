# 02 — `--changed` / `--base`: affected-test selection through Playwright

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3706 |
| Blocked by | T01 |

## What to build

`pnpm test:pw --changed[=<ref>] [--base <ref>]` runs only the tests the branch affects. The tool resolves
the merge-base of the base ref (default `origin/main`) and `HEAD`, lists the files changed since it
(committed and uncommitted, same semantics as the sibling gates), and then either runs the whole suite —
when any changed file falls under the force-full list (`src/icons/**`, `playwright/**`,
`playwright-ct.config.ts`, `pnpm-lock.yaml`) — or appends `--only-changed=<merge-base sha>` so Playwright's
CT plugin maps the diff through the bundler's module graph. A module-scoped ADR records why selection is
delegated to Playwright rather than a custom dependency walk. Demo: touch a leaf component and only its
dependents run; touch an icon and everything runs.

## Acceptance criteria

- [x] `--changed` (optional inline ref) and `--base <ref>` behave exactly as in `tools/code-complexity`:
      either enables diff mode, both set the base ref, `--changed` never swallows the next token.
- [x] Merge-base and changed-file listing come from `tools/code-complexity/select/diff.ts`
      (`resolveBaseCommit`, `getChangedFiles`) — imported, not copied.
- [x] The force-full list lives in `tools/playwright/config.ts` with a comment that pairs it with the
      `pw_changes` gate step in `.github/workflows/checks.yml` (ticket 04 adds the mirror comment there).
      Matching is by path prefix / exact path over repo-relative paths; a pure function `selectMode(changedFiles)
      → 'full' | 'only-changed'` owns the rule and is unit-tested (each of the four entries, a non-matching
      `src/` file, an empty list).
- [x] Under `--changed` with no forced-full hit, the tool appends `--only-changed=<sha>` to the Playwright
      argv (after the user's pass-through args). With a forced-full hit it appends nothing and prints one
      line naming the file that forced the full run.
- [x] Under `--changed` with an empty diff, the tool still invokes Playwright with `--only-changed=<sha>`
      (Playwright selects nothing; `--pass-with-no-tests` passed through by the caller decides the exit
      code) — the tool itself does not short-circuit, so local and CI behave the same.
- [x] Manual checks recorded in `notes.md`: (1) a whitespace edit to a leaf component's `.pw.tsx` sibling
      selects a handful of files; (2) an edit under `src/icons/` forces the full list; (3) a type-only
      file edit selects zero tests.
- [x] `tools/playwright/adr/0001-<slug>.md` per `.agents/rules/adr.md`, listed in the tool's `CONTEXT.md`:
      the decision (delegate to `--only-changed`), the evidence from the spec's implementation decisions
      (type-only import erased by the bundler; `TestApp` registered as a component so theme/toolkit edits
      select the full project; icons are the blind spot), and the rejected alternative (patching the
      `dependency-tree` walker).
- [x] `CONTEXT.md` gains the recurring-question rows: "why did my change run the full suite?" → force-full
      list; "why did it run zero tests?" → the bundler graph didn't reach a registered component.

## Details

- `git merge-base` needs history: local checkouts have it; CI gets `fetch-depth: 0` in ticket 04.
- `--only-changed` is a Playwright 1.46+ flag; the pinned `@playwright/test` is 1.57.0.
- `--only-changed --list` reports zero tests in CT mode; ticket 05 files that upstream. Do not build a
  dry-run here.

## Leaf worklist

- [x] 1 `[agent]` `--changed` / `--base` flags, `selectMode` + force-full config, `--only-changed` argv
      append; specs
- [x] 2 `[agent]` Manual selection checks → `notes.md`
- [x] 3 `[agent]` ADR `tools/playwright/adr/0001-…`, `CONTEXT.md` rows; lint, doc-links
