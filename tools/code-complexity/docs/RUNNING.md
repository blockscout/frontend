# Code complexity — running it

`pnpm test:code-complexity --help` is the flag reference. This document is what the flag list does not
tell you: how a selection turns into a vitest run, and how to read what comes back.

## Two independent axes

The interface mirrors vitest — **selection** (which functions) and **coverage source** (how the CRAP
half is fed). Any selection combines with any source.

| Selection | Scores |
| --- | --- |
| *(no arguments)* | every in-scope function, repo-wide |
| `<path...>` | every function in the given files, ignoring the diff |
| `--changed[=<ref>]` | only functions a changed line falls within |

`--changed` shells out to git without setting a working directory, so the diff it scores is the one at
the directory you invoked the command from. `./run.sh` resolves its own location in order to compile,
which lets it run from anywhere — that part is cwd-independent, the diff is not.

| Coverage source | How the CRAP half is fed |
| --- | --- |
| *(default)* | the tool runs vitest itself, scoped to the selection, into a throwaway temp dir |
| `--coverage-file <path>` | consume a prebuilt report and skip vitest |
| `--no-coverage` | cognitive gate only, which is always enforced either way |

`--verbose` streams vitest's output live and adds the cyclomatic (`CX`) column; otherwise vitest is
silent so the score table is what you see.

## Which files trigger a vitest run (generation scope)

Separately from per-function scoring, a *file* needs vitest coverage generated for it when it is a
**JSX-less logic file** *or* a **JSX file with a co-located vitest spec** (`Component.spec.tsx` next
to `Component.tsx`; Playwright `*.pw.tsx` does not count). This only decides whether
`vitest related`/`--changed` pulls the file in. A `behavior` function in a JSX file outside that set
is absent from the report and scores 0% without triggering a run.

Four consequences:

- **Vitest is skipped when nothing needs coverage.** Only files in the generation scope cause a run,
  so a focused run on a spec-less JSX component returns instantly — scoring its `behavior` functions
  0%, exactly as it would have had the run happened. Skipping the run is not `--no-coverage`:
  generation scope never decides which functions are scored, so a function's score never depends on
  what else shared its selection. A diff with nothing in scope prints "No functions to check." and
  runs nothing.
- **All three generated scopes select through the module graph** (`vitest related <paths>`,
  `vitest run --changed <merge-base>`, or the whole suite), so a file's coverage is the same however
  it was reached. A selection with no matching specs passes; a failing suite warns and still reports
  whatever coverage landed.
- **Primed-request drift tests (`*.primed.spec.tsx`) are excluded** from generated runs. They mount
  whole page trees to check the primer registry rather than to exercise behavior, costing tens of seconds 
  of page-mount time while contributing no meaningful coverage.
- **A function absent from the coverage report usually scores 0%, not `—`.** The one exception is a
  user-supplied `--coverage-file` in focused mode.

## The report

The default table shows `KIND`, `COG`, `COV`, `CRAP` and `BROKE`, sorted by CRAP descending; 
`jsx` and no-coverage rows sort to the bottom, tie-broken by `COG`. The two gates are independent: 
the cognitive cap trips on any in-scope function over its class's cap, the CRAP cap only on `behavior` 
functions with coverage data.

Under `$GITHUB_ACTIONS` the tool also emits `::error file=,line=::` annotations for offenders and
writes the table to `$GITHUB_STEP_SUMMARY`.
