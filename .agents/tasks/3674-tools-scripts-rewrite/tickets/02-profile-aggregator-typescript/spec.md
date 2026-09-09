# 02 — React profile aggregator in TypeScript

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 02 of #3674 |
| Blocked by | none |

## What to build

`pnpm profile:analyze <profile.json> [profileB.json] [--commit=N] [--commit-b=N] [--top=N] [--min-ms=N]`
keeps producing the same commit overview, per-component cost table and — with two files — delta table, from
a TypeScript source that `pnpm lint:tsc` checks and co-located specs exercise.

`tools/profiling/` keeps its shape and the aggregator stays one module: it breaks no cognitive cap, so its
lever is coverage rather than decomposition. Coverage is also what has to move — `replayOperations` scores
CRAP 182 today purely because nothing tests it.

## Acceptance criteria

- [x] `pnpm profile:analyze <export.json>` on a real React DevTools export prints the same commit list,
      header line, ranked table and top-N summary as the `.mjs` did, and the two-file form still prints both
      tables plus the delta.
- [x] `--commit`, `--commit-b`, `--top` and `--min-ms` keep their meanings and defaults (40 and 15); zero or
      three-plus file arguments still print the usage line and exit 1.
- [x] A malformed `operations` entry still warns naming the entry index and the file and degrades to partial
      attribution — it does not fail the run.
- [x] The DevTools export shape is typed; no implicit `any` survives, and `pnpm lint:tsc` passes.
- [x] `pnpm test:vitest` runs the new specs, and `./tools/code-complexity/run.sh tools/profiling` reports
      every function inside the cognitive cap and under CRAP 80 — `replayOperations` included.
- [x] No real-world DevTools profile export is committed; every fixture is hand-built and minimal.
- [x] The compiled output is git-ignored and nothing under it is committed.
- [x] `tools/code-complexity/select/scope.spec.ts` passes: the assertion naming the deleted
      `tools/profiling/aggregate-react-profile.mjs` now names a path that exists.

## Details

**Why fixtures, not an export.** An export pins the fixture to one DevTools version, and the wire format is
exactly what is under test. Hand-build the minimal `dataForRoots[0]` shape instead: a string table, one ADD
per element type including the root's extra four fields, a REMOVE, a REORDER_CHILDREN, the three fixed-width
ops, `snapshots` entries that the replay did not name, and a `commitData` array with `fiberSelfDurations`.

**Coverage arithmetic.** CRAP is `c²·(1 − cov)³ + c` on *cyclomatic* complexity — see
`tools/code-complexity/measure/crap.ts`. `replayOperations` sits at CRAP 182 with no coverage, so roughly a
quarter of its lines covered already clears the 80 cap; covering every op branch clears it comfortably.

**What the specs are for.** The op-code walk is the part that has actually broken before — see the
`operations` wire-format gotcha in `tools/profiling/CONTEXT.md`. Cover the string-table decode, each op's
index advance, the out-of-range string id throw, the snapshot fallback with and without `hocDisplayNames`,
aggregation's unattributed-fiber accounting, and the biggest-commit default.

**Entry file separate from the module.** The CLI section at the bottom of the `.mjs` — argument parsing,
`getOption`, the usage error, the print calls — moves into its own entry file, so the specs can import
`loadProfile` / `aggregate` / `replayOperations` without executing a run.

**Own tsconfig and wrapper.** `tools/profiling/` has no tsconfig today, so it is free to take one with an
`outDir`; `tools/code-complexity/tsconfig.json` and `run.sh` are the shape to follow, and
`pnpm profile:analyze` becomes the wrapper.

**`scope.spec.ts`.** `.mjs` stays a legitimate in-scope extension, so the fix is to swap the string, not the
predicate. The assertion in question is the one under "includes the repo tooling under `tools/`"; ticket 03
handles the separate one under "includes the plain-JS extensions".

**Docs.** `tools/profiling/CONTEXT.md`'s file table names the `.mjs`; the workflow section and the gotchas
below it stay true and should not be restated.

## Leaf worklist

- [x] 1 `[agent]` Port the aggregator to TypeScript in `tools/profiling/`, typing the DevTools export shape,
      with the CLI moved into a separate entry file
- [x] 2 `[agent]` Add `tools/profiling/tsconfig.json` and the compile-on-run `run.sh`; repoint
      `profile:analyze` and gitignore the compiled output
- [x] 3 `[agent]` Build the hand-written wire-format fixtures and write the co-located specs — operations
      replay per op code, string table, snapshot fallback, aggregation, commit selection
- [x] 4 `[agent]` Swap the stale `.mjs` path in `tools/code-complexity/select/scope.spec.ts`
- [x] 5 `[agent]` Update the `tools/profiling/CONTEXT.md` file table
- [x] 6 `[agent]` Verify: same output on a real export (kept out of the repo, per
      `tools/profiling/CONTEXT.md` use `.ai/tmp/`), `pnpm lint:tsc`, `pnpm test:vitest`, and the complexity
      gate on `tools/profiling`
