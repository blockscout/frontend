# 06 — Cognitive-complexity readability cap

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 06 of #3663 |
| Blocked by | T05 |

## What to build

Replace the standalone cyclomatic-complexity cap with a **Cognitive Complexity (CC)** cap as the
tool's sole readability gate. Cyclomatic complexity measures testability (independent paths ≈ tests
needed) and is the correct input to CRAP — it stays there, unchanged and internal. But it is a poor
"should a human decompose this?" signal: it scores a flat `switch` the same as an equivalent nested
`if/else` chain and is blind to nesting. The repo's high-cyclomatic `behavior` tail is dominated by
wide-but-shallow code (flat switches, `??`/`||` defaulting chains, flat if-ladders) that cyclomatic
over-penalises — forcing refactors on code that reads fine.

CC (SonarSource model) fixes exactly that: flat switches score cheap, nesting is penalised
progressively, boolean sequences collapse. This ticket computes CC on the tool's existing single AST
walk, makes it the readability cap for **both** function classes (per-kind caps, `jsx` higher than
`behavior`), and retires both cyclomatic caps and their flags. Cyclomatic complexity is no longer a
gate and no longer a default report column — it survives only as the CRAP input and behind
`--verbose`. When a function exceeds its COG cap the tool emits an **actionable** annotation naming
the specific increment sites, the deepest-nesting pocket, and the reduction flattening it would buy.
The caps are calibrated in-ticket against a fresh full-repo CC distribution to fire strictly less
often on real code than today's cyclomatic cap.

## Acceptance criteria

How to verify: `pnpm test:code-complexity --no-coverage` (full-repo COG report); `pnpm test:code-complexity src/shell/navigation/useNavItems.tsx` (spot-check a known wide-shallow offender now passes).

- [x] `FunctionComplexity` carries a `cognitive` score and a `contributions` list; CC follows the
  SonarSource model — nesting structures (`if`, `for`, `for..of`, `for..in`, `while`, `do`, `catch`,
  ternary) add `1 + nestingDepth`; `switch` adds +1 flat regardless of case count; `else` / `else if`
  add +1 with no nesting penalty; boolean **sequences** add +1 per run of like operators
  (`a && b && c` = +1, `a && b || c` = +2); recursion (direct, name-match) +1; labelled
  `break`/`continue` +1. `?.` is not counted.
- [x] CC is computed on the **same** per-function AST walk as cyclomatic — no second parse.
- [x] The readability gate is CC, per-kind: `DEFAULT_MAX_COGNITIVE_JSX` (higher backstop) and
  `DEFAULT_MAX_COGNITIVE_BEHAVIOR`, overridable by `--max-cognitive`, `--max-cognitive-jsx`,
  `--max-cognitive-behavior`. Applies to both `jsx` and `behavior` functions.
- [x] `DEFAULT_MAX_COMPLEXITY_JSX`, `DEFAULT_MAX_COMPLEXITY_BEHAVIOR` and all `--max-complexity*`
  flags are removed. `analyze.ts` reports `brokeCognitive` (per-kind) instead of a cyclomatic break.
- [x] Cyclomatic complexity still feeds CRAP unchanged (`c²·(1−cov)³ + c`); `--max-crap` and the CRAP
  cap are untouched. CC never feeds CRAP.
- [x] The default report shows `KIND`, `COG`, `CRAP`, `COV` — no CX column. CX appears only under
  `--verbose`. The table still sorts by CRAP descending; `BROKE` names `COG`, `CRAP`, or `COG+CRAP`.
- [x] On a COG violation the CLI emits an actionable annotation (GitHub `::error file=,line=::` and in
  the table/summary) listing the top increment contributors (line, amount, reason), the deepest
  nesting pocket, and the estimated reduction from flattening it.
- [x] Our CC is validated against `sonarjs/cognitive-complexity` on a sample of files; deltas are
  documented in `CONTEXT.md`. `eslint-plugin-sonarjs` is not left as a committed dependency and is not
  wired into the eslint config.
- [x] `(human)` The calibrated per-kind COG caps in `config.ts` are signed off — they isolate the
  genuinely-nested tail and clear wide-but-shallow code (net-looser than the retired cyclomatic cap).
  Signed off as a starting point; pushing the caps further is deferred to ticket 07.
- [x] `CONTEXT.md` is rewritten to describe the tool as it now stands (CC conventions, per-kind COG
  caps, the recursion name-match approximation and every divergence, the updated flag and column
  surface) with no history/diff narration; the `pnpm test:code-complexity` help text matches the new
  flags.

## Details

- **Tool internals touched:** `complexity.ts` (per-function walk — add nesting counter, CC accrual,
  contribution recording), `analyze.ts` (`brokeCognitive`), `report.ts` (`COG` column, `--verbose` CX,
  annotations), `config.ts` (defaults), `index.ts` (flags), `CONTEXT.md`. Read `CONTEXT.md` first.
- **Recursion is approximate** — the tool has no type-checker (`ts.createSourceFile` only), so
  recursion is detected by name match (a call whose callee text equals the enclosing function's name).
  This catches direct self-recursion; indirect/mutual recursion is not caught. Documented divergence,
  not a bug. Labelled `break`/`continue` is exact (purely syntactic).
- **`?.` stays excluded**, consistent with ADR 0004 — CC's model does not treat optional chaining as a
  branch or nesting structure, so the exclusion carries over for free. No new ADR for this ticket.
- **Calibration** mirrors ticket 05's method: a fresh full-repo run produces the CC distribution, caps
  set from the tail. Target: of today's 51 cyclomatic-≥11 `behavior` functions, the wide-shallow
  majority pass and only the deep-nested handful (e.g. `useEtherscanRedirects`) trip. Numbers are not
  pinned here — they come from the run and land in `config.ts`.
- **Report rationale:** CX is dropped from the default view because, with CC now governing
  decomposition, the only fix for a CRAP failure is added coverage, never lowering `c` — so CX is
  never actionable in the default table. It stays available under `--verbose` for calibration and
  tool debugging.

## Leaf worklist

- [x] 1 `[agent]` Compute CC on the existing AST walk — nesting counter, SonarSource increments,
  boolean-sequence runs, direct-recursion name-match, labelled break/continue; record per-increment
  `contributions {line, amount, reason}`; add `cognitive` + `contributions` to `FunctionComplexity`;
  unit tests covering each increment kind and the sequence/nesting/recursion cases.
- [x] 2 `[agent]` Retire cyclomatic gating — delete `DEFAULT_MAX_COMPLEXITY_*` + `--max-complexity*`;
  add `DEFAULT_MAX_COGNITIVE_JSX/_BEHAVIOR` + `--max-cognitive[-jsx|-behavior]`; `brokeCognitive`
  (per-kind) in `analyze.ts`; keep CX internal → CRAP only.
- [x] 3 `[agent]` Report surface — drop CX default column, add `COG`; keep `CRAP`/`COV`; CX behind
  `--verbose`; `BROKE` = `COG`/`CRAP`/`COG+CRAP`; COG-failure annotations list top contributors +
  deepest-nesting pocket + estimated reduction (GitHub `::error::` + step summary + table).
- [x] 4 `[agent]` Oracle-validate — install `eslint-plugin-sonarjs` temporarily, diff our CC vs
  `sonarjs/cognitive-complexity` on a sample, document deltas in `CONTEXT.md`, uninstall (not wired
  into eslint config).
- [x] 5 `[agent]` Calibrate — fresh full-repo CC run; set per-kind COG caps isolating the nested tail
  (net-looser than the retired cyclomatic cap) in `config.ts`. Pause for `(human)` cap sign-off.
- [x] 6 `[agent]` Rewrite `CONTEXT.md` clean — CC conventions, per-kind caps, recursion name-match +
  all divergences, updated flag/column surface; fix `pnpm test:code-complexity` help text.
