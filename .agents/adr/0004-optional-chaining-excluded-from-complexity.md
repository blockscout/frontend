# 0004 — optional chaining `?.` is excluded from cyclomatic complexity

| | |
| --- | --- |
| Status | accepted |
| Date | 2026-08-27 |
| Deciders | @tom2drum |
| Supersedes | — |

## Decision

The code-complexity gate (`tools/code-complexity/`) does **not** count optional chaining `?.`
toward a function's cyclomatic complexity. Every other construct matches ESLint's `complexity`
rule (`if`/`else if`, loops, `case`, `catch`, ternary, `&&`/`||`/`??`); `?.` is the single
deliberate divergence.

The textbook cyclomatic definition, and ESLint's rule, treat each `?.` as a branch because it
short-circuits. This gate does not.

## Why

**A `?.` is not a path a test must cover.** Cyclomatic complexity is only useful here as a proxy
for the number of independent paths through a function — roughly, the test cases needed to exercise
its branches — because CRAP (`c²·(1 − cov)³ + c`) multiplies that count against how untested the
code is. TypeScript already proves the nullability at every `?.` site at compile time; a unit test
adds nothing there. Counting `?.` therefore measures null-safety verbosity, not the branching risk
the gate exists to flag.

**It was the largest source of tail inflation.** Measured across all in-scope `src/**` functions
while calibrating the gate (issue #3663), `?.` was by a wide margin the biggest single contributor
to counted branch points, and dropping it materially lowered the top of the complexity distribution.
The inflation clustered on JSX components stuffed with optional prop reads — object literals and
JSX with many defensive field accesses and no control flow — not on genuinely branchy logic, so it
was noise for exactly the code the gate is meant to distinguish. The figures are in that work's PR.

**The "match ESLint" argument does not apply.** The counting was originally framed as matching
ESLint's `complexity` rule, but the repo does not configure or run that rule (`eslint.config.mjs`
has no `complexity` entry) and has no plan to. With no live rule to agree with, aligning to its
`?.` behavior buys nothing and costs the distortion above. The spec explicitly left this open to be
settled at calibration.

## Consequences

- The gate is a **conscious divergence** from ESLint's cyclomatic definition. A future reader — or a
  PR trying to align the tool with a standard complexity implementation — will see the gap and may
  try to "fix" it back; this record is what says not to. The counting convention and this caveat
  live in `tools/code-complexity/CONTEXT.md`.
- The gate's calibrated thresholds (`config.ts`) were set from the distribution *with `?.` already
  dropped*. Re-introducing `?.` counting would silently make the caps far more aggressive; the two
  decisions are coupled, and changing one demands recalibrating the other.
- Reversing is a one-case change in `countsAsBranch` (`complexity.ts`) plus its spec — cheap in
  code, but it invalidates the calibration, so it is an ADR-level decision, not a tweak.
