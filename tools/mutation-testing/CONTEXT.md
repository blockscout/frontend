# Mutation testing — context

A gate on **assertion strength**. It changes a line of code, reruns the specs, and checks whether any test notices. Coverage shows that a line executed; a surviving mutant shows that no test asserted its behavior.

## Where to look

| Question | Answer |
| --- | --- |
| The gate failed. What do I change? | the next section |
| How do I run it? What do the flags do? | `pnpm test:mutation-testing --help` |
| Why was my file or line never mutated? | `./docs/SCOPE.md` |
| Why only five mutator classes? Why no score threshold? | `./docs/SCOPE.md` |
| May I suppress a mutant? | `./docs/SUPPRESSING.md` |
| Why is a run slow or truncated? | `./docs/RUNNING.md` |
| Where does CI run it, and why in its own job? | `./docs/RUNNING.md` |
| Why does Stryker need repository-level setup? | `./docs/RUNNING.md` |
| Which file implements each part? | the file map below |

## The gate failed — what now

Reproduce the failure for your file:

```bash
pnpm test:mutation-testing path/to/your/file.ts
```

This mutates the entire file, while CI mutates only changed lines. A focused run may therefore find survivors that do not affect the gate. Only mutants on your diff are gating.

**`SURVIVED` — the failure.** The mutator name describes the change, such as forcing a condition to a constant, changing `<` to `<=`, `&&` to `||`, or `+` to `-`. Ask what behavior the change affects and assert on it.

Valid outcomes:

- the test checks the wrong thing — **add the missing assertion**;
- the change has no observable effect — **delete the redundant branch, guard, or operand**;
- the versions are equivalent by construction — **suppress the mutant** according to `./docs/SUPPRESSING.md`.

A test that only executes the line does not kill the mutant. Mutation testing checks assertions, not just coverage.

**`NO COVERAGE` — not this gate's finding.** No test reached the line. The CRAP gate (`../code-complexity/CONTEXT.md`) already reports this as insufficient coverage. It appears here as a count and never fails the run.

**`Run TRUNCATED`** — the wall-clock budget expired, so the results cover only part of the selection. A green result is not a pass. See `./docs/RUNNING.md`.

## File map

The process has four stages: **select** files and lines → **run** Stryker → **read** the results → **render** the output.

### Root

- `./index.ts` — CLI flags, stage order, and exit code
- `./config.ts` — default budget, base ref, and shared paths
- `./stryker.config.json` — fixed Stryker settings, mutator classes, and determinism requirements
- `./vitest.config.ts` — the Vitest configuration Stryker uses
- `./run.sh` — compile-and-run wrapper
- `./tsconfig.json` — covers this folder and `../code-complexity`

### `select/`

- `./select/files.ts` — selection modes, eligibility, and empty-run exits
- `./select/ranges.ts` — eligible lines and exclusions

These reuse Git plumbing, scope rules, and function classification from `../code-complexity`.

### `stryker/`

- `./stryker/invoke.ts` — runs, limits, and stops Stryker without orphaned processes
- `./stryker/streaming-reporter.mts` — preserves results from interrupted runs
- `./stryker/stream.ts` — reads streamed results
- `./stryker/results.ts` — selects complete or truncated results
- `./stryker/report.ts` — report structure, scores, findings, and failure conditions

### `render/`

- `./render/table.ts` — per-file score table
- `./render/findings.ts` — survivors and no-coverage findings
- `./render/truncation.ts` — partial-run warning
- `./render/github.ts` — PR diff annotations

### `eslint/`

- `./eslint/well-formed-disable.mjs` — enforces the suppression policy defined in `./docs/SUPPRESSING.md`