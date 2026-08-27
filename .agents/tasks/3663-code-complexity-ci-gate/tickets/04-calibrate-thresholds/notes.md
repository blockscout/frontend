# Ticket 04 — calibration evidence

## Method

- Generated whole-suite vitest coverage once (`vitest run` with `*.primed.spec.tsx` excluded,
  v8 provider, json reporter): **80 test files, 558 tests passing**, one `coverage-final.json`.
- Ran the tool full-repo (default selection) against that report via `--coverage-file`, with the
  caps set absurdly high so nothing is flagged — the table is then the full distribution.
- **6,538 functions** in scope across **2,472 files**. The CRAP half applies to **2,060** of them
  (JSX-less logic files + JSX components with a co-located vitest spec); the other 4,478 are
  JSX-without-spec and get the complexity gate only.

## The `?.` decision (dropped — ADR 0004)

Optional chaining was counted at first (matching ESLint's `complexity` rule). Measured impact:

- `?.` was **20.6% of all counted branch points** (3,157 of 15,340).
- It inflated the tail: with `?.` → complexity p99 = 22, p99.5 = 27, max = 166; without → p99 = 17,
  p99.5 = 21, max = 120.
- **45 functions** cross a cap of 20 only because of `?.`; **24** cross 25 only because of `?.`.
- Extreme case: `ActivityTab.tsx:114` (`tasks` memo) — a static array of descriptor objects with no
  control flow — scored **22 with `?.`, 2 without**, entirely from ~20 defensive field reads.

Decision: **drop `?.`**. TypeScript proves each site's nullability at compile time, so no unit test
covers it — counting it measures null-safety verbosity, not branching risk. The repo does not run
ESLint's `complexity` rule, so there is no live rule to stay aligned with. Rationale in ADR 0004;
all figures below are with `?.` **not** counted.

## Distribution (`?.` not counted)

### Cyclomatic complexity — all 6,538 functions

p50 = 2, p90 = 6, p95 = 9, **p99 = 17, p99.5 = 21, max = 120**.

| bucket | count |    | cap | flagged | share |
|--------|------:|----|-----|--------:|------:|
| 1–5    | 5,800 |    | > 20 | 38 | 0.6% |
| 6–10   |   511 |    | > 25 | 18 | 0.3% |
| 11–15  |   138 |    | > 30 | 11 | 0.2% |
| 16–20  |    51 |    |      |    |      |
| 21–25  |    20 |    |      |    |      |
| 26–30  |     7 |    |      |    |      |
| 31+    |    11 |    |      |    |      |

### CRAP — 2,060 applicable functions

p50 = 2, p90 = 20, p95 = 42, **p99 = 156, p99.5 = 306, max = 2,352**. 1,415 of the 2,060 sit at 0%
coverage (untested logic — the population the gate targets).

| cap  | flagged | share | at 0% cov, first trips at complexity |
|------|--------:|------:|--------------------------------------|
| > 30 | 106 | 5.1% | 6 |
| > 50 |  68 | 3.3% | 7 |
| > 75 |  42 | 2.0% | 9 |

## Chosen thresholds

**`DEFAULT_MAX_COMPLEXITY = 20`**, **`DEFAULT_MAX_CRAP = 50`** (`tools/code-complexity/config.ts`).

- **20** sits just above complexity p99.5 (21): flags 38 functions (top ~0.6%) — a clean tail, not
  a flood. 25 (18 functions) was the conservative alternative; 20 is chosen for a bit more reach
  now that `?.` noise is gone.
- **50** requires a 0%-covered function to exceed complexity 7 before it trips, flagging 68 logic
  functions (~top 3%). The provisional 30 tripped on any 0%-covered complexity-6 helper (106
  functions, common shape) — too eager.
- Combined union at (20, 50): **102 functions repo-wide**. CI only ever sees the diff-scoped subset,
  so day-to-day friction is far lower — these are the pre-existing-debt population, not CI hits.

The CRAP tail is dominated by 0%-covered hooks/utils in logic files (`useNavItems`,
`prepareRequestBody`, `useValidateField`, `useChartDataQuery`, `useCallMethodWalletClient`,
`useFetchTokens`, …) — genuinely complex-and-untested code, which is exactly what the gate is for.
