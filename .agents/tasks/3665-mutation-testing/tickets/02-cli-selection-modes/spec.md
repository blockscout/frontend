# 02 — The CLI and its three selection modes

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3665 |
| Blocked by | T01 |

## What to build

`pnpm test:mutation-testing`, a CLI that decides which files to mutate, invokes Stryker over them, and
prints a per-file score table read from Stryker's JSON report.

Three selection modes mirror the complexity gate's flags: bare invocation takes the full eligible set,
explicit paths focus on those files, and `--changed[=<ref>]` scopes to the diff against a base ref
(default `origin/main`, through the merge-base). A file is eligible only when a vitest spec sits beside it;
a file with no unit test produces no findings rather than a run of unkillable mutants. When the selection
resolves to nothing, the CLI says why in one line and exits 0 without invoking Stryker at all.

Whole files are mutated in this ticket. Narrowing to changed lines and excluding `jsx` bodies is T03.

## Acceptance criteria

How to verify: `pnpm test:mutation-testing tools/code-complexity/measure/crap.ts`

- [x] Bare invocation selects every eligible file under the scope allowlist; explicit paths select exactly
      those files; `--changed` selects the files the diff touches, and `--changed=<ref>` honours the ref.
- [x] A file with no co-located `*.spec.ts` / `*.spec.tsx` is never mutated in any mode, including when
      named explicitly.
- [x] `--changed` on a branch with no in-scope changes prints one explanatory line, exits 0, and never
      spawns Stryker (verifiable by the absence of a fresh sandbox and the run's wall time).
- [x] `--changed` resolves through the merge-base: commits landing on `origin/main` after the fork point
      never appear in the selection.
- [x] Output is a per-file table with score, mutants, killed, survived and no-coverage columns, built from
      the JSON report — Stryker's clear-text reporter is not used.
- [x] `--help` documents the three modes.
- [x] The tool's own files pass the complexity gate (`pnpm test:code-complexity --changed`).
- [x] Unit specs cover eligibility, mode resolution and the empty-selection exit.

## Details

**Reuse, do not reimplement (parent spec).** `tools/code-complexity/select/diff.ts` supplies
`resolveBaseCommit`, `getChangedFiles`, `getAllSourceFiles` and `getChangedLineRanges`;
`tools/code-complexity/select/scope.ts` supplies `isInScope`. Import them directly across tool directories —
extracting a shared location is warranted only if a third consumer appears.

**Eligibility (FR3)** is the same naming-convention check `tools/code-complexity/index.ts` already makes in
`hasCoLocatedSpec`; Playwright `*.pw.tsx` files do not count.

**Shape.** Follow the code-complexity layout: a `run.sh` that compiles through a local `tsconfig.json` into a
gitignored `dist/` and then runs `dist/index.js`, an `index.ts` that parses flags and orchestrates, specs
beside what they test. Its flag-parsing table (`FLAGS`, `applyArg`) is the pattern to follow for
`--changed[=<ref>]`, which must not swallow the following token.

**Package script.** `"test:mutation-testing": "./tools/mutation-testing/run.sh"`, beside
`test:code-complexity`.

## Leaf worklist

- [x] 1 `[agent]` Scaffold `tools/mutation-testing/` — `run.sh`, `tsconfig.json`, gitignored `dist/`, package
      script
- [x] 2 `[agent]` Selection: eligibility check, the three modes, the empty-selection early exit; specs
- [x] 3 `[agent]` Invoke Stryker over the selection and parse its JSON report
- [x] 4 `[agent]` Render the per-file table; specs
