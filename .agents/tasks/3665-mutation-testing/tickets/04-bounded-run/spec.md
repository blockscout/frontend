# 04 — Bound a run by wall-clock time, report what completed

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3665 |
| Blocked by | T02 |

## What to build

A wall-clock budget on any single run, so a selection that reaches deep into the import graph cannot grind
for hours. When the budget expires the Stryker process is stopped and the results collected up to that point
are reported, with the output stating plainly that the run was truncated and how much of the selection it
covered.

Stryker writes its JSON report only when the whole run finishes, so a killed process would otherwise leave
nothing behind. A small custom reporter plugin closes that gap: it appends each mutant's result as it is
tested, and the CLI falls back to that stream when the run did not finish. The normal, complete path still
reads Stryker's own JSON report untouched.

## Acceptance criteria

- [ ] A run that exceeds the budget is stopped and still prints a report covering the mutants tested before
      the cutoff.
- [ ] The output states the run was truncated and how much of the selection was covered. A truncated run is
      never presented as a complete one.
- [ ] A run that finishes inside the budget is byte-identical to what T02 produced — the streaming path
      changes nothing on the normal path.
- [ ] The reporter plugin is named explicitly in `stryker.config.json`'s plugin list, alongside the vitest
      runner (pnpm's layout defeats Stryker's plugin globbing).
- [ ] Stopping the run leaves no orphaned vitest or Stryker child processes and no stale sandbox directory.
- [ ] The budget is a named constant in the tool's config module, overridable per invocation.
- [ ] Unit specs cover parsing the streamed results and the truncated-vs-complete decision.

## Details

**Why time and not mutant count (FR12).** Runtime is governed by import-graph centrality, not mutant count —
five leaf utilities with 140 mutants ran in 10 seconds while one 28-mutant file imported across the app took
70, because Stryker's dry run executes everything related to it. A mutant-count bound would additionally have
to track Stryker's own generator to stay honest, and any drift would make the bound lie.

**The plugin** hooks Stryker's per-mutant reporter event and appends one record per line to a file under
`tools/mutation-testing/reports/`, so a partial file is always parseable. It is declared through Stryker's
plugin declaration API and loaded by explicit path.

**Config precedent** for the budget constant: `tools/code-complexity/config.ts` keeps its caps in one module
so a local run and a CI run gate identically.

## Leaf worklist

- [ ] 1 `[agent]` Write the streaming reporter plugin and register it in `stryker.config.json`
- [ ] 2 `[agent]` Enforce the budget: stop the run at expiry, clean up children and the sandbox
- [ ] 3 `[agent]` Read the streamed results on a truncated run and mark the report truncated; specs
