# code-complexity — context

A CI gate that flags code which is both complex and under-tested before it merges, scoped to
what a PR actually changes so it never blocks on pre-existing debt. Two independent gates run, both
keyed off one per-function property — **does the function directly contain JSX?** A `jsx` function
(a render body) gets a high complexity backstop and no CRAP; a `behavior` function (handler, hook,
util) gets a tighter complexity cap and the coverage-aware CRAP cap. See
"Function classes and which gates apply" below.

## Running it

The interface has two independent axes, mirroring vitest: **selection** (which functions) and
**coverage source** (how the coverage half is obtained). Any selection combines with any source.

```bash
pnpm test:code-complexity                          # full repo: every in-scope src/** function
pnpm test:code-complexity src/foo.ts               # focused: every function in these files
pnpm test:code-complexity --changed                # diff: functions the diff touches vs origin/main
pnpm test:code-complexity --changed=<ref>          # diff against a different base ref (or --base <ref>)
pnpm test:code-complexity --max-complexity <n>          # override both complexity caps
pnpm test:code-complexity --max-complexity-jsx <n>      # override the jsx (render-body) cap only
pnpm test:code-complexity --max-complexity-behavior <n> # override the behavior (logic) cap only
pnpm test:code-complexity --max-crap <n>           # override the CRAP cap
pnpm test:code-complexity --coverage-file <path>   # consume a prebuilt coverage-final.json, skip vitest
pnpm test:code-complexity --no-coverage            # skip coverage, complexity gate only
pnpm test:code-complexity --verbose                # stream vitest output (hidden by default)
```

Vitest output is hidden by default so the score table is what you see; a failing run still prints a
warning (re-run with `--verbose` to see why).

**Vitest is skipped when no coverage is needed.** Only files that need coverage generated (see
"Which files trigger a vitest run" below) cause a vitest run, so a selection with none — e.g. a
focused run on a JSX component that has no co-located spec — runs no vitest at all and returns
instantly with the complexity gate only.

### Selection (which functions)

- **Full repo (default).** No paths and no `--changed`: every in-scope `src/**` function. Used for
  threshold calibration — it produces the repo-wide CRAP distribution.
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
  module graph, so a given file's coverage is the same however it was reached — focused, diff, and
  full agree on its number. A run with no matching specs passes (`--passWithNoTests`); a failing
  suite warns but still reports what coverage landed.

  **Primed-request drift tests (`*.primed.spec.tsx`) are excluded** from these runs. They mount
  whole page trees to check the primer registry, not to exercise behavior, and they import huge
  swaths of the app — so `related` would otherwise pull them in for almost any file, costing tens
  of seconds of page-mount time while contributing no meaningful coverage. Excluding them keeps
  coverage to what real behavior/logic specs execute (and is why a focused run on a test-less hook
  now finishes in ~1s at 0% instead of running a dozen page suites).
- **Prebuilt (`--coverage-file <path>`).** Consume an existing report instead of running vitest.
  This is the **CI path**: the `vitest_tests` job already produces coverage, so the gate reads that
  artifact (`--changed --coverage-file …`) rather than regenerating it. Also handy for threshold
  calibration — generate whole-suite coverage once, then iterate the full-repo report against it.
- **Off (`--no-coverage`).** Skip coverage entirely; only the complexity cap runs. The complexity
  cap is always enforced, with or without coverage data.

`run.sh` compiles the tool with the repo-local TypeScript (emitting to `dist/`, git-ignored) and
runs it — the same compile-on-run pattern as `tools/dev-server/fetch.sh`, so no global toolchain
is needed. The parser is the `typescript` compiler API (`ts.createSourceFile` + `ts.SyntaxKind`);
there is no type-checker and no external service.

Thresholds are defaults in `config.ts`, overridable by flags — CI carries no threshold numbers,
so a local run and a CI run gate identically.

## What counts toward complexity

Per-function cyclomatic complexity starts at **1** and adds **1** for each of:

- `if` and `else if` (each `if` node; a bare `else` adds nothing)
- `for`, `for..of`, `for..in`
- `while`, `do..while`
- each `case` clause
- `catch`
- a ternary (`? :`)
- each `&&`, `||`, `??`, and their compound-assignment forms `&&=`, `||=`, `??=`

**Not counted:** a bare `else`, `default:`, the `switch` statement itself, JSX
(`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`), and **optional chaining `?.`**. A
`&&`/`||`/`??` written *inside* a JSX expression container still counts — it is a logical operator,
not JSX structure.

Excluding `?.` is a deliberate divergence from the textbook cyclomatic definition and from ESLint's
`complexity` rule, which both treat each `?.` as a branch; the two agree on every other construct.
ADR 0004 has the reasoning.

Every function is its own unit: nested functions, arrow functions, methods, accessors, and the
constructor each start their own count of 1, and a branch counts toward the innermost enclosing
function. Code at module scope belongs to no function and is not reported.

## CRAP score

CRAP (Change Risk Anti-Patterns) combines complexity with test coverage:

```
CRAP = c²·(1 − cov)³ + c
```

where `c` is the function's cyclomatic complexity and `cov` is its line-coverage fraction (0..1).
Well-covered code scores near its complexity (`cov = 1` gives exactly `c`); the cubic `(1 − cov)`
term makes complex, untested code explode. At 0% coverage the score is `c² + c`, so an untested
function stays under a given CRAP cap only until it grows past a modest complexity.

Per-function coverage is joined from a v8/istanbul `coverage-final.json` (the v8 provider emits the
istanbul shape). A function's coverage is the fraction of *coverable* lines in its line range that
were executed — a line is coverable when it carries a statement, and its hit count is the highest
among the statements starting on it, exactly as istanbul's `getLineCoverage()` computes it. A
function with no coverable lines counts as fully covered, so CRAP reduces to its complexity.

## Function classes and which gates apply

Every function is classified — independently of its file's extension — by whether **JSX appears
directly in its own body**, outside any nested function:

- **`jsx`** — a render body (a component, or an inline `items.map(x => <Row/>)` callback: the JSX is
  in the callback's own body). Because a branch accrues to the innermost enclosing function, a
  component's render body is just its own JSX-level control flow; its handlers are separate units.
- **`behavior`** — everything else: event handlers, `useCallback`/`useMemo` bodies, hooks, and utils,
  *wherever they live* — including nested inside a component. A JSX-less `.tsx` hook is `behavior`;
  a handler defined inside a component is `behavior` even though the component around it is `jsx`.

Classification is read from the AST (`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`), not the
extension — ~78 non-test `.tsx` files contain no JSX (mostly `useX.tsx` hooks), so the extension is
an unreliable component-vs-logic signal. The two classes gate differently:

| class | complexity cap | CRAP |
| --- | --- | --- |
| `jsx` | `--max-complexity-jsx` (high backstop) | never scored |
| `behavior` | `--max-complexity-behavior` (tighter) | scored |

**Why `jsx` carries no CRAP.** A component's rendering is covered by Playwright visual tests
(`*.pw.tsx`), which emit no vitest coverage — so a `jsx` function would read ~0% and flood the report.
Its high complexity cap is a monster-backstop: hitting it means "decompose this render body," and it
stays high on purpose so it never pushes people toward condition-swallowing refactors.

**Why every `behavior` function is CRAP-scored.** This is where under-tested logic hides and where
neither Playwright nor (often) vitest covers it, so it carries both the tighter complexity cap and
CRAP — including a handler inside a spec-less component, which scores 0% (an accurate "no unit test
exercises this"). This is a *per-function* rule: a spec'd component's render loses its (noise) CRAP
score while its handlers gain a real one. It supersedes the earlier *file-level* rule ("JSX-less
file, or JSX file with a co-located spec").

### Which files trigger a vitest run (generation scope)

Separately from per-function scoring, a *file* needs vitest coverage generated for it when it is a
**JSX-less logic file** *or* a **JSX file with a co-located vitest spec** (`Component.spec.tsx` next
to `Component.tsx`; Playwright `*.pw.tsx` does not count). This is unchanged by the per-function rule
— it only decides whether `vitest related`/`--changed` pulls the file in. A `behavior` function in a
JSX file outside that set is absent from the report and scores 0% without triggering a run.

**Missing coverage = 0% vs "no data".** A `behavior` function absent from the coverage report is
scored 0% when absence means "no spec executed it" — i.e. for generated coverage (any mode) and the
CI `--coverage-file` report — which correctly flags untested code. The one exception is a
**user-supplied `--coverage-file` in focused mode**: a hand-passed report may simply predate the
file, so absence there reports `—` (no data), not a fabricated 0%.

The two gates are independent: the complexity cap trips on any in-scope function over its class's cap;
the CRAP cap trips only on `behavior` functions with coverage data. The report's `KIND` column shows
each function's class, `BROKE` names which cap each offender crossed (`CX`, `CRAP`, or `CX+CRAP`), and
the table sorts by CRAP descending.

## Scope

- **Files:** `src/**` `.ts`/`.tsx`, excluding specs (`*.spec.*`, `*.pw.tsx`, `*.pwstory.tsx`),
  declaration files (`*.d.ts`), the toolkit build output (`src/toolkit/package/**`), and anything
  outside `src/` (so `tools/`, `deploy/` fall out for free).
- **Functions (diff mode):** only functions a changed line falls within are gated. A changed line
  is any new-side line of the diff between the working tree and the merge-base of the branch and
  the base ref — this captures the branch's own commits plus uncommitted edits. Functions in a
  changed file that the diff did not touch are listed in the table but never flagged.
- **Focused mode** bypasses diff-scoping entirely and scores every function in the given files.
