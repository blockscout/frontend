# 01 — Complexity CLI with diff-scoped cyclomatic gate

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 01 of #3663 |
| Blocked by | none |

## What to build

The tracer bullet: a runnable `tools/code-complexity/` CLI, wired to `pnpm test:code-complexity`,
that gates raw cyclomatic complexity on the functions a diff touches. It resolves the in-scope file
set (`src/**` `.ts`/`.tsx`, minus the FR7 exclusions), parses each file with `ts.createSourceFile`
(no type-checker), and computes per-function cyclomatic complexity matching ESLint's `complexity`
rule. It maps git-diff hunks against a base ref (default `origin/main`) to function line-ranges and
selects the functions a changed line falls within. It gates each in-scope function against the raw
complexity cap (a configurable default living in the tool, overridable by a CLI flag), prints a
table of **all** checked functions — `file:line`, name, complexity, offenders flagged, sorted by
complexity descending — and exits non-zero if any function exceeds the cap. A **focused mode** takes
explicit file paths instead of a diff and reports complexity for every function in those files. No
coverage, CRAP, or JSX handling yet — those are ticket 02.

## Acceptance criteria

- [ ] Per-function cyclomatic complexity matches ESLint's `complexity` rule on the FR2 constructs
      (base 1; `+1` for `if`/`else if`, `for`/`for..of`/`for..in`, `while`, `do`, each `case`,
      `catch`, ternary, `&&`, `||`, `??`, each optional-chaining `?.`; not counted: `else`,
      `default:`, `switch`, JSX), with nested/arrow/method functions counting as their own units
      — covered by unit tests.
- [ ] File scope resolves to `src/**` `.ts`/`.tsx` and excludes specs (`*.spec.*`, `*.pw.tsx`,
      `*.pwstory.tsx`), generated files (`*.d.ts`, `envs.js`, sprite output), `tools/`, `deploy/`,
      and toolkit build output.
- [ ] Diff mode against `origin/main` gates only functions a changed line falls within; a function
      untouched by the diff is listed but never flagged as an offender.
- [ ] The complexity cap is a configurable default in the tool, overridable by a CLI flag, and is
      enforced with no coverage data present.
- [ ] Focused mode (`pnpm test:code-complexity <path…>`) reports complexity for every function in
      the given files, bypassing diff-scoping.
- [ ] On a violation the CLI exits non-zero and prints the full table sorted by complexity
      descending with offenders flagged; on no violation it exits zero.
- [ ] `CONTEXT.md` documents the counting conventions; it names no third-party service.

## Details

- Parser: the `typescript` package (`npm:@typescript/typescript6` alias) — `ts.createSourceFile` +
  `ts.SyntaxKind`, no `ts.createProgram` / type-checker.
- Base ref default `origin/main`, overridable by flag; the base-ref and threshold flags are the
  same surface CI (ticket 03) and calibration (ticket 04) drive.
- Table columns land as complexity-only here; ticket 02 adds coverage% and CRAP and re-sorts by
  CRAP descending (FR8's final ordering).

## Skill inputs

None — no project skill (`add-api-resource`, `add-new-page`, …) applies to this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Complexity counter — AST walk over `ts.createSourceFile`, ESLint-`complexity`
      parity, function-unit detection; with unit tests
- [ ] 2 `[agent]` File-scope resolver — `src/**` `.ts`/`.tsx` with FR7 exclusions; with unit tests
- [ ] 3 `[agent]` Diff-scoping — git hunks vs base ref → touched function line-ranges; focused-mode
      path input as the alternate entry
- [ ] 4 `[agent]` CLI + threshold config + table report + non-zero exit; `pnpm test:code-complexity`
      script in `package.json`
- [ ] 5 `[agent]` `tools/code-complexity/CONTEXT.md` — counting conventions
