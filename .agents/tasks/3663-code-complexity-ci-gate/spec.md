# Add a cyclomatic-complexity and CRAP-score CI gate

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3663 |
| Feature branch | `issue-3663` |
| PM | — (frontend tooling task) |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Complex, under-tested code lands unnoticed today: nothing measures per-function
cyclomatic complexity, and the coverage tooling reports only statement/branch/function/line
coverage, never complexity or CRAP. The goal is a CI gate that flags code which is both
complex and under-tested — CRAP = `c²·(1 − cov)³ + c` — before it merges, scoped to what a
PR actually changes so it never blocks on pre-existing debt.

## Functional requirements

1. A `tools/code-complexity/` CLI computes per-function cyclomatic complexity by walking the
   TS/TSX syntax tree via the `typescript` compiler API (`ts.createSourceFile`), with no
   type-checker.
2. Complexity counting matches ESLint's `complexity` rule: base 1 per function; +1 each for
   `if` / `else if`, `for` / `for..of` / `for..in`, `while`, `do`, each `case`, `catch`,
   ternary, `&&`, `||`, `??`. Not counted: `?.`, `else`, `default:`, `switch` itself, JSX.
   Nested/arrow/method functions count as their own units.
3. The tool computes CRAP `c²·(1 − cov)³ + c` per function by joining complexity with
   per-function line coverage read from a v8/istanbul `coverage-final.json`.
4. The coverage half (CRAP) applies only to files containing **no JSX**, detected from the
   AST (`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`) — not the file extension.
   Files containing JSX get the complexity gate only.
5. The gate scopes to **functions touched by the diff** against a base ref (default
   `origin/main`) — a function is in scope when a changed line falls within its body. No
   baseline artifact is kept.
6. Two independent thresholds gate: a raw cyclomatic-complexity cap and a CRAP threshold,
   both configurable. The complexity cap is enforced even when no coverage data is present.
7. File scope is `src/**` `.ts`/`.tsx`, excluding specs (`*.spec.*`, `*.pw.tsx`,
   `*.pwstory.tsx`), generated files (`*.d.ts`, `envs.js`, sprite output), `tools/`,
   `deploy/`, and toolkit build output.
8. On any violation the CLI exits non-zero. It always prints a table of **all** checked
   functions (file:line, name, complexity, coverage %, CRAP, which threshold if broken),
   sorted by CRAP descending, offenders flagged. Under `$GITHUB_ACTIONS` it additionally
   emits `::error file=,line=::` annotations for offenders and writes the table to
   `$GITHUB_STEP_SUMMARY`.
9. The gate runs inside the existing `vitest_tests` CI job: coverage is enabled on the
   affected-tests run, and the tool runs as a post-step consuming that `coverage-final.json`.
10. A `pnpm test:code-complexity` script runs the tool locally against the `origin/main` diff.
11. A **focused mode** takes one or more explicit file paths and reports the scores
    (complexity, and CRAP when coverage is available) for **every** function in those files,
    bypassing diff-scoping. It exists for debugging a specific example and for verifying a
    newly written or edited function sits within threshold before pushing.
12. Thresholds live in the tool as configurable defaults (constants/config under
    `tools/code-complexity/`), overridable by CLI flags; CI carries no threshold numbers, so a
    local run and a CI run gate identically.
13. The counting conventions are documented in `tools/code-complexity/CONTEXT.md`.

## Data & API

None. No endpoints, resources, env vars, or feature flags.

## UI inventory

None. This is CI/tooling only; no routes, pages, or components.

## Implementation decisions

- **Bespoke tool, no external service.** Built on the `typescript` compiler API, already a
  dependency (the `@typescript/typescript6` alias exposes `ts.createSourceFile` and
  `ts.SyntaxKind`), keeping the pipeline self-contained with no external service or CI
  secrets. This rationale stays in the spec only — the shipped tool and its `CONTEXT.md` do
  not name or compare against any specific third-party service.
- **Coverage rides the per-PR affected-tests run.** CI's `vitest_tests` job already runs
  `vitest run --changed=origin/main`; add `--coverage` (`@vitest/coverage-v8`, already
  resolvable in the pnpm store). Because `vitest --changed` runs every spec that
  *transitively imports* a changed module, the coverage collected for a changed file equals
  its whole-suite coverage — so affected-scoped coverage is correct, not an undercount. This
  corrects the issue's "free rider on the coverage run CI already produces" premise: CI
  produced **no** coverage before, and on PRs runs only changed specs.
- **Missing coverage = 0%.** A changed in-scope file absent from `coverage-final.json` is
  treated as 0% coverage (derived from the git-changed file list), rather than enabling a
  global `coverage.all`. For a JSX-less logic file this correctly flags untested code.
- **Granularity: touched functions only.** Map git diff hunks to function line ranges; gate
  only functions the diff added or modified. No committed baseline, no keying scheme to
  maintain.
- **JSX detection is AST-based, not extension-based.** ~78 non-test `.tsx` files currently
  contain no JSX (mostly `useX.tsx` hooks), so the extension is an unreliable
  component-vs-logic signal. Classification is free — the tool already parses every file.
  (Aligning extensions with content is tracked separately in issue #3668, out of scope here.)
- **Thresholds calibrated from real data as the final step.** Provisional CRAP 30 /
  complexity 20; the tool will be run repo-wide to produce the CRAP distribution, and the
  numbers set from it before the gate is turned on. Noted because at 0% coverage CRAP > 30
  trips at complexity ≥ 6, which the distribution should confirm is the genuine tail rather
  than a flood.
- **CI-only gate, no husky hook** — coverage-dependent and too slow for a commit hook.
- **Residual risk:** a changed file exercised only through a dynamic import or other
  non-static path the module graph misses would be undercounted and could fail falsely; rare
  in this codebase, and the changed-scope + touched-function limits contain the blast radius.

## Out of scope

- Adopting SonarCloud / any external quality-gate service.
- A baseline of pre-existing violations (superseded by the touched-functions scope).
- Coverage for JSX components / remapping Playwright component-test coverage.
- Enforcing the `.tsx`→`.ts` rename and the `react/jsx-filename-extension` rule (issue #3668).
- Gating the whole repo or historical code; the gate is strictly diff-scoped.
