# 02 — Screen a change on the standards grid

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 02 of #3720 |
| Blocked by | T01 |

## What to build

`pnpm review:screen` (`tools/review-screen/`) takes a change — `--scope branch|uncommitted`, or explicit
`--base <ref>` and `--spec <path>` — resolves the touched files (untracked included), scores every rubric
rule against every matching file with Jev, and prints suspects as JSON on stdout. Every run also writes one
sidecar JSON to `.ai/jev/` in the main checkout. With no `TYPESAFE_API_KEY`, or on any API failure, it
exits 0 with `status: skipped|failed` and a reason. The spec grid is a stub in this ticket: the output
carries `spec: { status: 'not-implemented' }` until ticket 03 replaces it.

## Acceptance criteria

How to verify: `TYPESAFE_API_KEY=… pnpm review:screen --scope branch` on this branch; then unset the key
and run again.

- [ ] `pnpm review:screen --help` documents `--scope`, `--base`, `--spec`, `--ticket`; unknown flags are
      rejected with usage (`tools/cli/flags.ts`, `reject` policy).
- [ ] `--scope branch` resolves base = merge-base with `main`; `--scope uncommitted` diffs `HEAD` against
      the working tree; both include untracked files (`git ls-files --others --exclude-standard`). Explicit
      `--base`/`--spec` are used verbatim and never re-derived.
- [ ] Spec path resolution mirrors `review-changes`: branch `issue-<n>` → `.agents/tasks/<n>-*/spec.md`;
      no task folder → no spec (recorded, not an error).
- [ ] Per touched file, the scored state is the file's changed hunks with surrounding context (`git diff
      -U<n>`), each line prefixed with a stable line id (`L<new-side line number>`); an untracked file is
      one hunk covering the whole file.
- [ ] One `systemOne` request per file (or window) carries every rule whose glob matches the file as named
      `noul` questions, `model: 'jev-1.13.0'`; a state over the window budget is split into windows and
      the cell takes the max across windows.
- [ ] A cell over its threshold (`config.ts`: `DEFAULT_STANDARDS_THRESHOLD`, per-rule
      `STANDARDS_THRESHOLD_OVERRIDES`) gets one `choice` call over the changed line ids of the scoring
      window to locate the line; the suspect records `{ rule, file, line, score }`.
- [ ] Suspects are capped at `MAX_SUSPECTS` (config), highest score first; the JSON says how many were cut.
- [ ] No key → `{ status: 'skipped', reason }`, exit 0. SDK `APIError`/`APIConnectionError` after the
      SDK's retries → `{ status: 'failed', reason }`, exit 0, and the sidecar still records the cells scored
      so far.
- [ ] Sidecar: `<main-checkout>/.ai/jev/<YYYY-MM-DD>-<branch>-<scope>[-<NN>].json` (main checkout =
      parent of `git rev-parse --git-common-dir`); records inputs (base, scope, spec path, files), every
      cell `{ rule, file, window, score }`, suspects, `model` from the response, per-call `ms` and `usage`.
      The JSON on stdout names the sidecar path.
- [ ] `tools/review-screen/CONTEXT.md` exists with a "Where to look" table, and `.agents/AGENTS.md` lists
      it in the per-directory list; `pnpm lint:doc-links` passes.
- [ ] vitest specs cover: flag parsing, hunk → line-id state rendering, windowing, threshold/cap
      selection, sidecar file naming, skipped/failed status — with the SDK client injected (`fetch`
      option or a client interface), never a live call.

## Details

- Layout mirrors `tools/code-complexity/`: `index.ts` (flags + orchestration + exit code), `config.ts`,
  `run.sh` (compile-on-run, `rootDir: ..` so the shared `../cli/flags` import lands one level deeper),
  `tsconfig.json`, `CONTEXT.md`. Add `"review:screen": "./tools/review-screen/run.sh"` to `package.json`
  and `tools/review-screen/dist/` to `.gitignore` + the eslint ignore list (see how
  `tools/code-complexity/dist/` is listed).
- Git plumbing: import `resolveBaseCommit` and `getChangedFiles` from
  `../code-complexity/select/diff` (the precedent `tools/mutation-testing/select/files.ts` sets); add
  untracked-file listing and unified-diff-with-context extraction locally in `select/`.
- `@typesafe-ai/sdk` is a `devDependencies` entry (pinned, `0.6.0` at the time of writing). The client
  reads the key itself from `TYPESAFE_API_KEY`; construct it inside a try so a missing key becomes
  `skipped` instead of a thrown `TypeSafeError`. Use `noul(question, { true: examples, false: not_for })`
  and `choice(locateQuestion, { L12: null, L13: null, … })` from the SDK.
- Window budget: the SDK gives no token counter; use a character budget in `config.ts`
  (`MAX_STATE_CHARS`, start at ~100k chars ≈ 25k tokens, leaving room under the 32k state + longest
  question limit) and split hunks on hunk boundaries first, then on lines.
- `--ticket <NN>` is optional; under `--scope uncommitted` with no `--ticket`, take the first unchecked box
  in the task's `progress.md` (as `output-md.md` does). `--scope branch` writes no ticket segment.
- Output shape on stdout:

  ```json
  {
    "status": "ok | skipped | failed",
    "reason": "skipped/failed only",
    "model": "jev-1.13.0",
    "sidecar": "/abs/path/.ai/jev/….json",
    "standards": { "cells": 120, "suspects": [ { "rule": "…", "file": "…", "line": 42, "score": 0.83 } ], "cut": 0 },
    "spec": { "status": "not-implemented" }
  }
  ```

## Leaf worklist

- [x] 1 `[agent]` Add `@typesafe-ai/sdk` dev dependency, `tools/review-screen/{run.sh,tsconfig.json,config.ts}`, the `review:screen` script, dist ignores
- [x] 2 `[agent]` `select/`: scope/base/spec/ticket resolution, touched + untracked files, hunks-with-context → line-id state, windowing (+ specs)
- [x] 3 `[agent]` `grid/standards.ts`: per-file `noul` batch, `choice` locate, thresholds and cap → suspects (+ specs with an injected client)
- [x] 4 `[agent]` `sidecar.ts`: main-checkout resolution, file naming, cells/timings/usage/model record (+ specs)
- [x] 5 `[agent]` `index.ts`: flags, orchestration, `skipped|failed` handling, JSON output; `CONTEXT.md` + `AGENTS.md` line
