# 02 — CRAP score: coverage join + JSX gating

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 02 of #3663 |
| Blocked by | T01 |

## What to build

Extend the CLI to the second, coverage-aware gate. Detect whether a file contains JSX from the AST
(`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`), not its extension. Read per-function line
coverage from a v8/istanbul `coverage-final.json` (path via a CLI flag), join it to the complexity
already computed, and compute CRAP `c²·(1 − cov)³ + c` per function. A changed in-scope file absent
from the coverage file counts as 0% coverage (derived from the git-changed file list). The CRAP
threshold — a second configurable default in the tool — gates only functions in **JSX-less** files;
JSX-containing files keep the complexity gate alone. The table gains coverage% and CRAP columns,
records which threshold each offender broke, and sorts by CRAP descending (FR8's final ordering).
Focused mode reports CRAP too whenever a coverage file is supplied.

## Acceptance criteria

- [ ] JSX detection is AST-based; a `.tsx` file with no JSX (e.g. a `useX.tsx` hook) is classified
      as logic and gets the CRAP gate, a `.tsx` with JSX gets complexity-only — covered by tests.
- [ ] Per-function CRAP `c²·(1 − cov)³ + c` is computed from complexity joined with per-function
      line coverage read from `coverage-final.json` — covered by tests.
- [ ] A changed in-scope JSX-less file missing from `coverage-final.json` is treated as 0% coverage
      and flagged when its CRAP exceeds the threshold.
- [ ] Both gates run independently: the complexity cap on every in-scope function, the CRAP
      threshold on JSX-less ones only; the table names which threshold an offender broke.
- [ ] The table shows `file:line`, name, complexity, coverage %, CRAP, threshold-broken, sorted by
      CRAP descending, offenders flagged.
- [ ] Focused mode with a coverage file reports CRAP per function alongside complexity.

## Details

- CRAP threshold default is the second tool-config value beside the complexity cap from T01;
  provisional values stay until calibration (ticket 04).
- Coverage granularity is per-function line coverage; map v8/istanbul function/line entries onto the
  same function line-ranges T01 already derives from the AST.

## Skill inputs

None — no project skill applies to this ticket.

## Leaf worklist

- [ ] 1 `[agent]` AST JSX detection + file classification (logic vs component); with unit tests
- [ ] 2 `[agent]` `coverage-final.json` reader → per-function line coverage; missing-file = 0%
      from the git-changed list; with unit tests
- [ ] 3 `[agent]` CRAP computation + second (CRAP) threshold gating JSX-less files only; with tests
- [ ] 4 `[agent]` Extend the table (coverage%, CRAP, threshold-broken columns; CRAP-descending
      sort) and focused-mode CRAP output
- [ ] 5 `[agent]` Update `CONTEXT.md` with the CRAP formula, JSX rule, and 0%-coverage convention
