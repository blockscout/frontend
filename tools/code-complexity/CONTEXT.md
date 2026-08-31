# code-complexity — context

A CI gate that flags code which is either hard to read *or* both complex and under-tested, before it
merges — scoped to what a PR actually changes so it never blocks on pre-existing debt. Two independent
gates run:

- **Cognitive Complexity (CC)** — the readability gate. Capped per function class (`jsx` vs
  `behavior`). This is the "should a human decompose this?" signal.
- **CRAP** — the under-testedness gate. `behavior` functions only, fed by *cyclomatic* complexity
  joined with coverage. This is the "complex and untested?" signal.

Both gates key off one per-function property — **does the function directly contain JSX?** A `jsx`
function (a render body) gets a high CC backstop and no CRAP; a `behavior` function (handler, hook,
util) gets a tighter CC cap and the coverage-aware CRAP cap. See "Function classes and which gates
apply" below.

Cyclomatic complexity is not a gate on its own. It measures testability (independent paths ≈ tests
needed) and is the correct input to CRAP, so it lives on internally and behind `--verbose`. It is a
poor readability signal — it scores a flat `switch` the same as an equivalent nested `if` chain and is
blind to nesting — which is why CC, not cyclomatic, is the decomposition gate.

## Running it

The interface has two independent axes, mirroring vitest: **selection** (which functions) and
**coverage source** (how the coverage half is obtained). Any selection combines with any source.

```bash
pnpm test:code-complexity                            # full repo: every in-scope function
pnpm test:code-complexity src/foo.ts                 # focused: every function in these files
pnpm test:code-complexity --changed                  # diff: functions the diff touches vs origin/main
pnpm test:code-complexity --changed=<ref>            # diff against a different base ref (or --base <ref>)
pnpm test:code-complexity --max-cognitive <n>            # override both cognitive caps
pnpm test:code-complexity --max-cognitive-jsx <n>        # override the jsx (render-body) cap only
pnpm test:code-complexity --max-cognitive-behavior <n>   # override the behavior (logic) cap only
pnpm test:code-complexity --max-crap <n>             # override the CRAP cap
pnpm test:code-complexity --coverage-file <path>     # consume a prebuilt coverage-final.json, skip vitest
pnpm test:code-complexity --no-coverage              # skip coverage, cognitive gate only
pnpm test:code-complexity --verbose                  # stream vitest output + add the cyclomatic (CX) column
```

Vitest output is hidden by default so the score table is what you see; a failing run still prints a
warning (re-run with `--verbose` to see why).

**Vitest is skipped when no coverage is needed.** Only files that need coverage generated (see
"Which files trigger a vitest run" below) cause a vitest run, so a selection with none — e.g. a
focused run on a JSX component that has no co-located spec — runs no vitest at all and returns
instantly with the cognitive gate only.

### Selection (which functions)

- **Full repo (default).** No paths and no `--changed`: every in-scope function (see "Scope"). Used for
  threshold calibration — it produces the repo-wide CC and CRAP distributions.
- **Focused (`<path...>`).** Every function in the given files, ignoring the diff.
- **Diff (`--changed[=<ref>]`, or `--base <ref>`).** Only functions a changed line falls within,
  vs the base ref (default `origin/main`). This is the CI gate — it never blocks on pre-existing
  debt. When nothing in scope changed, the tool prints "No functions to check." and does not run
  vitest.

### Coverage source (how the CRAP half is fed)

The CRAP gate needs per-function coverage. Three sources behind one interface; the default just
works — no pre-step:

- **Generated (default).** The tool runs vitest itself and reads the `coverage-final.json` it
  writes to a throwaway temp dir. Scope matches the selection: focused → `vitest related <paths>`
  (specs transitively importing the given files), diff → `vitest run --changed <merge-base>` (the
  specs the diff affects), full → `vitest run` (the whole suite). All three select through the
  module graph, so a given file's coverage is the same however it was reached. A run with no matching
  specs passes (`--passWithNoTests`); a failing suite warns but still reports what coverage landed.

  **Primed-request drift tests (`*.primed.spec.tsx`) are excluded** from these runs. They mount
  whole page trees to check the primer registry, not to exercise behavior, and import huge swaths of
  the app — so `related` would otherwise pull them in for almost any file, costing tens of seconds of
  page-mount time while contributing no meaningful coverage.
- **Prebuilt (`--coverage-file <path>`).** Consume an existing report instead of running vitest.
  This is the **CI path**: the `vitest_tests` job already produces coverage, so the gate reads that
  artifact (`--changed --coverage-file …`) rather than regenerating it. Also handy for threshold
  calibration — generate whole-suite coverage once, then iterate the full-repo report against it.
- **Off (`--no-coverage`).** Skip coverage entirely; only the cognitive cap runs. The cognitive cap
  is always enforced, with or without coverage data.

`run.sh` compiles the tool with the repo-local TypeScript (emitting to `dist/`, git-ignored) and
runs it — the same compile-on-run pattern as `tools/dev-server/fetch.sh`, so no global toolchain is
needed. The parser is the `typescript` compiler API (`ts.createSourceFile` + `ts.SyntaxKind`); there
is no type-checker and no external service. Both scores are computed on **one** walk of the tree.

Thresholds are defaults in `config.ts`, overridable by flags — CI carries no threshold numbers, so a
local run and a CI run gate identically.

## Cognitive Complexity (the readability gate)

CC follows the SonarSource model: flat control flow scores cheap, nesting is penalised
progressively, and boolean runs collapse. A function starts at **0** and accrues:

| Construct | Increment |
| --- | --- |
| `if`, `for`, `for..of`, `for..in`, `while`, `do`, `catch`, ternary (`? :`), `switch` | `1 + nesting²` |
| `else`, `else if` | `+1` (no nesting penalty; the chain stays at its base level) |
| a run of like boolean operators (`&&` / `\|\|`) | `+1` per run |
| direct self-recursion (name match) | `+1` |
| labelled `break` / `continue` | `+1` |

**Nesting** is increased by `if` (its then-branch), `else`/`else if` (their body), ternary (its
branches), the loops, `catch` (its body), and `switch` (its cases). Each of those nesting structures
pays `1 + nesting²` for itself and deepens the level for what it contains, so a construct three
levels in costs `1 + 9`. `switch` gets exactly **one** increment (carrying the nesting penalty)
regardless of how many `case`s it has — unlike cyclomatic, which counts every `case`.

The **quadratic** nesting penalty is a deliberate divergence from SonarSource's linear `1 + nesting`
(ADR 0005). It is identical at depths 0 and 1 and bites only from the third level in, so flat and
shallow code is untouched while genuinely-nested code accelerates away. That is what decouples
breadth from nesting: flat breadth accrues at `+1` per decision and stays put, which lets one cap
forgive wide-but-shallow logic and still catch the nested tail. No linear cap could separate the two.

**Boolean sequences.** A maximal run of the *same* operator costs `+1`; switching operator starts a
new run. `a && b && c` = `+1`; `a && b || c` = `+2` (an `&&` run and a `||` run). Parentheses break a
run. Boolean increments carry no nesting penalty. Compound logical assignments (`&&=`, `||=`) are not
sequence operators and add nothing to CC.

**Recursion is approximate.** With no type-checker, self-recursion is detected by name match — a call
whose callee is the bare identifier the function is bound to. This catches direct self-recursion in a
function declaration, a named function expression, or a `const f = () => … f() …` arrow. It does not
catch `this.method()`, destructured/aliased calls, or indirect/mutual recursion. A documented
approximation, not a bug. Labelled `break`/`continue` is exact (purely syntactic).

**`?.` and `??` are not counted.** Optional chaining is excluded per ADR 0004 — CC's model does not
treat it as a branch or a nesting structure, so the exclusion carries over for free. Null-coalescing
(`??`, `??=`) is excluded because the SonarSource white paper itself ignores it as readable shorthand,
in the same class as `?.`; counting it measured defaulting verbosity, not readability (at calibration
the worst case was an API-model mapper — a flat wall of `x ?? null` field assignments with no control
flow — scoring 14, as much as genuinely branchy logic; it now scores 0). ADR 0005 records this as an
extension of ADR 0004's reasoning. Cyclomatic complexity still counts `??`, matching
ESLint's `complexity` rule — the two scores diverge here on purpose.

Every cognitive increment is recorded as a `{ line, amount, reason, nesting }` contribution, so a
violation annotation can name the sites that cost the most and point at the deepest nesting pocket.

### Per-function units and nesting reset (divergence from SonarSource)

Every function is its own unit: nested functions, arrows, methods, accessors and the constructor each
start their own count, and both nesting and increments accrue only to the innermost enclosing
function. **Nesting resets to 0 at a nested-function boundary** — a control structure inside a
callback is scored relative to that callback, not to the component around it. SonarSource instead adds
a nesting level when descending into a nested function and rolls its complexity up into the parent;
our per-unit model (which also matches how cyclomatic is reported here) does not. This is the main
structural divergence from the reference model.

### Validation against the SonarSource oracle

Our CC was diffed against `eslint-plugin-sonarjs`'s `cognitive-complexity` rule (installed
temporarily; **not** a committed dependency and **not** wired into the eslint config) on a repo-wide
sample. That exercise validated the *shape* of the model — which constructs increment, where nesting
deepens, how `switch` and `else if` are treated — and the scores agreed on flat and shallow code. Our
tool is **not** expected to match the oracle numerically, and three known divergences explain the
deltas:

- **Nesting is quadratic here, linear there** (ADR 0005) — a deliberate divergence, so any function
  with a construct at depth ≥ 2 scores higher for us. This is the divergence with teeth; it is what
  the caps in `config.ts` are calibrated against.
- **Boolean operators.** The pinned oracle version (`eslint-plugin-sonarjs@4.2.0`) diverges from the
  written SonarSource model: it scores pure `||` chains as **0** and collapses any expression
  containing `&&` to a single `+1`. We implement the written model (`+1` per run of like operators)
  and treat it as authoritative.
- **`??` is ignored here** — matching the white paper, which the oracle version does not.

Nesting-heavy code is therefore expected to read higher than the oracle by design — at calibration a
hook built from nested `switch` trees scored 23 here against the linear model's 15. Do not treat
oracle parity as a regression test.

## CRAP score

CRAP (Change Risk Anti-Patterns) combines **cyclomatic** complexity with test coverage — CC never
feeds CRAP:

```
CRAP = c²·(1 − cov)³ + c
```

where `c` is the function's cyclomatic complexity and `cov` is its line-coverage fraction (0..1).
Well-covered code scores near its complexity (`cov = 1` gives exactly `c`); the cubic `(1 − cov)`
term makes complex, untested code explode. At 0% coverage the score is `c² + c`.

Per-function coverage is joined from a v8/istanbul `coverage-final.json` (the v8 provider emits the
istanbul shape). A function's coverage is the fraction of *coverable* lines in its line range that
were executed — a line is coverable when it carries a statement, and its hit count is the highest
among the statements starting on it, exactly as istanbul's `getLineCoverage()` computes it. A
function with no coverable lines counts as fully covered, so CRAP reduces to its complexity.

Because CC governs decomposition, the only fix for a CRAP failure is added coverage — never lowering
`c` — so cyclomatic complexity (CX) is not a default report column; it appears only under `--verbose`,
for calibration and tool debugging.

## Function classes and which gates apply

Every function is classified — independently of its file's extension — by whether **JSX appears
directly in its own body**, outside any nested function:

- **`jsx`** — a render body (a component, or an inline `items.map(x => <Row/>)` callback: the JSX is
  in the callback's own body). A component's handlers are separate units.
- **`behavior`** — everything else: event handlers, `useCallback`/`useMemo` bodies, hooks, and utils,
  *wherever they live* — including nested inside a component. A JSX-less `.tsx` hook is `behavior`;
  a handler defined inside a component is `behavior` even though the component around it is `jsx`.

Classification is read from the AST (`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`), not the
extension — ~78 non-test `.tsx` files contain no JSX (mostly `useX.tsx` hooks), so the extension is an
unreliable component-vs-logic signal. The two classes gate differently:

| class | cognitive cap | CRAP |
| --- | --- | --- |
| `jsx` | `--max-cognitive-jsx` (high backstop) | never scored |
| `behavior` | `--max-cognitive-behavior` (tighter) | scored |

**Why `jsx` carries no CRAP.** A component's rendering is covered by Playwright visual tests
(`*.pw.tsx`), which emit no vitest coverage — so a `jsx` function would read ~0% and flood the report.
Its high cognitive cap is a monster-backstop: hitting it means "decompose this render body."

**Why every `behavior` function is CRAP-scored.** This is where under-tested logic hides and where
neither Playwright nor (often) vitest covers it, so it carries both the tighter cognitive cap and
CRAP — including a handler inside a spec-less component, which scores 0% (an accurate "no unit test
exercises this"). A spec'd component's render loses its (noise) CRAP score while its handlers gain a
real one.

### Which files trigger a vitest run (generation scope)

Separately from per-function scoring, a *file* needs vitest coverage generated for it when it is a
**JSX-less logic file** *or* a **JSX file with a co-located vitest spec** (`Component.spec.tsx` next
to `Component.tsx`; Playwright `*.pw.tsx` does not count). This only decides whether
`vitest related`/`--changed` pulls the file in. A `behavior` function in a JSX file outside that set
is absent from the report and scores 0% without triggering a run.

**Missing coverage = 0% vs "no data".** A `behavior` function absent from the coverage report is
scored 0% when absence means "no spec executed it" — i.e. for generated coverage (any mode) and the
CI `--coverage-file` report. The one exception is a **user-supplied `--coverage-file` in focused
mode**: a hand-passed report may simply predate the file, so absence there reports `—` (no data).

## The report

The default table shows `KIND`, `COG`, `COV`, `CRAP`, and `BROKE`, sorted by CRAP descending. `BROKE`
names which cap each offender crossed — `COG`, `CRAP`, or `COG+CRAP`. `--verbose` inserts the `CX`
(cyclomatic) column. The two gates are independent: the cognitive cap trips on any in-scope function
over its class's cap; the CRAP cap trips only on `behavior` functions with coverage data.

Under `$GITHUB_ACTIONS` the tool also emits `::error file=,line=::` annotations for offenders and
writes the table to `$GITHUB_STEP_SUMMARY`. A cognitive-cap annotation is **actionable**: it lists the
top increment sites (`reason +amount` with its line), the deepest nesting pocket, and an estimate of
how much flattening that pocket by one level would save.

## Thresholds

Defaults live in `config.ts`, overridable by flags — CI carries no numbers. They are calibrated from a
full-repo CC run and are coupled to the increment model — `?.`/`??` excluded (ADR 0004, 0005) and
quadratic nesting (ADR 0005) — and to each other. Changing any of those silently makes the caps
wrong, so re-tune them together against a fresh full-repo run, never one in isolation. The current
caps and the calibration figures behind them are documented in `config.ts`.

## Scope

- **Files:** an **allowlist** of two roots — the app (`src/`) and the repo's own tooling (`tools/`) —
  with the extension set `.ts` `.tsx` `.mjs` `.js` `.cjs`. Excluded within them: specs (`*.spec.*`,
  `*.pw.tsx`, `*.pwstory.tsx`), declaration files (`*.d.ts`), configuration (`*.config.*`), and build
  output (`src/toolkit/package/**`, `tools/**/dist/`). Nothing about tooling code makes complexity or
  missing tests cheaper, which is why it is an allowlist of directories rather than a `src/` prefix
  test that let everything else fall out by accident.

  Two categories are deliberately **out**:

  - **`deploy/**`** — ESLint ignores the directory outright and every `deploy/tools/*` package sits
    outside the root TypeScript project. Making this gate its first and only automated check is
    backwards; bringing `deploy/` under ESLint and `tsc` first is issue #3675.
  - **`playwright/**`, `vitest/**`, `*.config.*`, and the repo-root runtime files** (`proxy.ts`,
    `instrumentation*.ts`, `startup.node.ts`) — test support and configuration are out on the same
    grounds specs are; the root files measured clean, and an allowlist of two directories is worth
    more than covering them.

  **The gate scores its own implementation.** `tools/code-complexity/**` is in scope, so a change to
  the increment model re-scores `complexity.ts` under the new model and carries whatever refactor its
  own numbers then demand — budget for that when touching the counting conventions.
- **Functions (diff mode):** only functions a changed line falls within are gated. A changed line is
  any new-side line of the diff between the working tree and the merge-base of the branch and the base
  ref — this captures the branch's own commits plus uncommitted edits. Functions in a changed file
  that the diff did not touch are listed in the table but never flagged.
- **Focused mode** bypasses diff-scoping entirely and scores every function in the given files.
