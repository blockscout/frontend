# 0005 — cognitive complexity penalises nesting quadratically and ignores `??`

| | |
| --- | --- |
| Status | accepted |
| Date | 2026-08-31 |
| Deciders | @tom2drum |
| Supersedes | — |

## Decision

The Cognitive Complexity (CC) score in `tools/code-complexity/` diverges from the SonarSource model
in two coupled ways:

1. **Nesting is charged `1 + n²`, not `1 + n`** (n = 0-based depth). Every structural increment that
   carries a nesting penalty — `if`, ternary, the loops, `catch`, `switch` — pays the quadratic
   price. `else`/`else if` and boolean runs stay flat `+1`, and `switch` is still one increment
   regardless of case count.
2. **Null-coalescing `??` and `??=` add nothing.** They are dropped from the boolean-sequence
   operator set. `&&` and `||` still cost `+1` per run.

The two are one decision: the caps in `config.ts` are calibrated against this exact model.

## Why

**The gate's thesis is "forgive breadth, punish nesting" — the linear model cannot express it.**
The SonarSource white paper counts breadth: every `if`/ternary/loop/`catch` is `+1` whether flat or
not, with nesting layered on as an *additional* per-level increment. Under that model the repo's
worst flat-breadth hooks scored 18 while its deep-nested `switch`-tree hook — the example the parent
spec named as a required trip — scored 15. They **overlap**, so no cap separates them: tight enough
to catch the nesting also catches the breadth. That was the false-positive problem the first-pass
caps shipped with.

**Quadratic nesting is a surgical surcharge on the deep tail.** Consecutive differences are the odd
numbers (1, 3, 5, …): each level costs 2 more than the last. It is *identical* to linear at depths 0
and 1 and diverges only from the third level in, so flat and shallow code — the bulk of the
distribution, whose percentiles do not move — is untouched while genuinely-nested code accelerates
away. That separation is what a single cap needs. On the full repo it lifts 7 of the 8 functions
firing at the recalibrated behavior cap of 20, including the nested anchor above (15 → 23, tripping
with margin), while leaving the flat-breadth band below the cap.

**`??` was a spec-conformance bug, not a divergence.** The SonarSource paper explicitly ignores
null-coalescing as readable shorthand, in the same class as `?.`. Counting it measured defaulting
verbosity: at calibration the worst case was an API-model mapper — a flat wall of `x ?? null` field
assignments with no control flow — scoring 14, as much as genuinely branchy logic. Dropping it takes
that to 0. This is ADR 0004's reasoning
(`?.` is null-safety verbosity, not a path a reader or a test must follow) extended from cyclomatic
to cognitive, and applied to the operator the paper already excluded.

**Right-leaning ternary-chain flattening was considered and rejected.** SonarSource flattens
`a ? x : b ? y : z` so the chain reads as one decision ladder. An eslint rule already bans nested
ternaries in this repo, so any nested ternary that survives review is genuine nesting and should be
priced as such.

## Consequences

- **CC here is not the SonarSource number, and is not expected to be.** Comparing against
  `eslint-plugin-sonarjs` will show us reading higher on anything nested past depth 1. That is by
  design; oracle parity is not a regression test. The counting conventions and the full list of
  divergences live in `tools/code-complexity/CONTEXT.md`.
- **The model and the caps are one decision.** `DEFAULT_MAX_COGNITIVE_BEHAVIOR` / `_JSX` were set
  from the full-repo distribution *under this model*. Reverting either change — re-counting `??`, or
  going back to linear nesting — silently makes the caps wrong (far looser, since scores collapse),
  so a change to the increment model demands a fresh full-repo recalibration in the same PR.
- The behavior cap sits at a natural gap in the resulting distribution rather than being pinned to
  one trip example: the flat-breadth band tops out at 20 and the nested band starts at 21. That gap
  exists *because* of the quadratic penalty; it does not survive a return to linear.
- Reversing is small in code — `nestingIncrement` in `complexity.ts` and one entry in
  `SEQUENCE_OPERATORS` — which is exactly why it needs this record: it looks like a two-line
  simplification and is not.
