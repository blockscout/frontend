# 07 — Quadratic nesting + `??` exclusion, recalibrate caps

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 07 of #3663 |
| Blocked by | none (T06 landed) |

## What to build

Reshape the Cognitive Complexity (CC) model so the readability gate isolates *nesting* and stops
punishing *breadth*, then re-set the caps on the resulting distribution. Ticket 06 shipped CC as the
SonarSource-linear model with first-pass caps; the investigation beside this file (`research.md`) found
the behavior tail is driven by breadth far more than nesting, and that two changes fix it — one aligning
the tool *to* SonarSource, one deliberately diverging *from* it.

1. **Exclude null-coalescing from CC.** `??` and `??=` are dropped from the boolean-sequence increment.
   The SonarSource white paper explicitly ignores null-coalescing as readable shorthand (same class as
   `?.`), so counting it was a spec-conformance bug that inflated pure-defaulting functions
   (`toTokenModel` scored 14 from 14 flat `?? null` lines → 0). This extends ADR 0004's `?.` reasoning.

2. **Penalise nesting quadratically.** Every structural increment that carries a nesting penalty changes
   from `1 + n` to `1 + n²` (n = 0-based nesting depth). This is a conscious divergence from SonarSource's
   linear model: it is a no-op at depths 0–1 and bites only at depth ≥ 3, so flat and shallow code is
   unchanged while genuinely-nested code climbs. This is what decouples breadth from nesting — flat
   breadth accrues linearly at `+1` each and stays put, deep nesting accelerates away — which no single
   linear cap could separate.

3. **Recalibrate both per-kind caps** against a fresh full-repo run with both changes applied.
   `behavior` moves **14 → 20** and `jsx` is re-confirmed against the new distribution. Under the new
   model the cap sits at a natural gap in the data, not pinned to one trip example: the flat-breadth band
   tops out ~20 and the genuinely-nested band starts at 21, so cap 20 catches the nested tail (the anchor
   `useEtherscanRedirects` now trips at 23, with margin) while forgiving the flat-breadth false positives
   (`useMarketplaceApps` 18, `getFormDefaultValues` 18) that motivated this ticket.

The gate's flag/column surface, CRAP, and the `jsx`/`behavior` classification are untouched. The change
is confined to the increment model and the calibrated caps, plus the records that explain them.

## Acceptance criteria

How to verify: `pnpm test:code-complexity --no-coverage` (fresh full-repo COG report). Spot-check the
decoupling: `pnpm test:code-complexity src/features/marketplace/hooks/useMarketplaceApps.tsx` (flat, CC 18
— **passes** at 20) and `pnpm test:code-complexity src/shared/router/useEtherscanRedirects.ts` (nested, CC
23 — **trips**).

- [x] `??` and `??=` no longer produce a cognitive increment (removed from the boolean-sequence
  operator set in `complexity.ts`); `?.` remains excluded. `complexity.spec.ts` covers a `??` chain
  scoring 0 and no longer asserts the old `??` increment.
- [x] Nesting increments use `1 + nestingDepth²` at every structural site that carried `1 + nestingDepth`
  (`if`, ternary, `for`/`for..of`/`for..in`/`while`/`do`, `catch`, `switch`); `else`/`else if` stay flat
  `+1`, boolean sequences stay flat `+1`, `switch` is still one increment regardless of case count.
  `complexity.spec.ts` asserts the quadratic values (e.g. a depth-3 `if` scores `1 + 4 = 5`).
- [x] `config.ts`: `DEFAULT_MAX_COGNITIVE_BEHAVIOR = 20`; `DEFAULT_MAX_COGNITIVE_JSX` set from the fresh
  jsx distribution. The calibration comment block is rewritten to the new distribution and rationale
  (drop the stale `??`/linear figures; state the quadratic model and the natural-gap cap choice).
- [x] `(human)` The recalibrated per-kind COG caps are signed off — behavior 20 isolates the
  genuinely-nested tail (7 of 8 firing functions climbed under quadratic; `useNavItems` is the one flat
  outlier that stays) and forgives the flat-breadth band, and jsx sits at the new distribution's natural
  backstop. Both remain net-looser than the retired cyclomatic cap.
- [x] `CONTEXT.md` and the oracle-validation record are reframed: CC now **deliberately diverges** from
  `eslint-plugin-sonarjs` on nesting (quadratic, not linear) and aligns with the SonarSource white paper
  on `??` (both ignored). The ticket-06 "nesting matches sonarjs exactly" parity claim is removed, and
  any oracle spec no longer asserts linear parity.
- [x] ADR 0005 records the divergence — quadratic nesting **and** `??` exclusion, the breadth-vs-nesting
  rationale, and the calibration coupling (changing the model invalidates the caps). It cross-references
  ADR 0004 (whose `?.` reasoning it extends to `??`). Its index line is added to the root `CLAUDE.md` ADR
  list.
- [x] `pnpm test:code-complexity` (full suite) passes; the CLI help text remains accurate (no flag
  surface changed).

## Details

- **Tool internals touched:** `complexity.ts` (drop `??` from the sequence-operator set; the five
  `1 + nesting` increment sites → `1 + nesting * nesting`), `complexity.spec.ts` (update the affected
  increment assertions), `config.ts` (caps + comment), `CONTEXT.md`, plus the oracle-validation spec/notes
  from ticket 06. Read `CONTEXT.md` first.
- **The quadratic change touches `jsx` too** — it applies to every function, not just `behavior`. The jsx
  distribution barely moves (p99 19→20, max 89→92), so the jsx cap is re-confirmed rather than
  redesigned, but leaf 2 must set it from the actual fresh run, not carry 25 over blind.
- **Calibration evidence is in `research.md`** (this folder) under the session-2 decision section: the
  full behavior distribution under `1+n²` (?? excluded), the per-cap firing table, the 8-function firing
  list at cap 20 classified deep-vs-flat, and the jsx numbers. The recalibration leaf reproduces this run
  and must land on the same targets.
- **Reproduce the distribution** the way `research.md` documents (`getAllSourceFiles` → `isInScope` →
  `computeFunctionComplexities`, bucket by `containsJsx`), after the model change is in place — no
  throwaway patched module needed once `complexity.ts` carries the new increments.
- **ADR coupling** — the caps in `config.ts` are only meaningful under this exact increment model.
  Reverting either change (re-count `??`, or go back to linear nesting) silently makes the caps wrong; the
  ADR records that the two are one decision.

## Leaf worklist

- [x] 1 `[agent]` Model change in `complexity.ts` — remove `??`/`??=` from the boolean-sequence operator
  set; change the five nesting-increment sites (`if`, ternary, loop, `catch`, `switch`) from
  `1 + nesting` to `1 + nesting * nesting`; update `complexity.spec.ts` (quadratic increment values; `??`
  chain scores 0).
- [x] 2 `[agent]` Recalibrate `config.ts` — fresh full-repo run under the new model; set
  `DEFAULT_MAX_COGNITIVE_BEHAVIOR = 20` and `DEFAULT_MAX_COGNITIVE_JSX` from the jsx natural gap; rewrite
  the calibration comment. Pause for `(human)` cap sign-off.
- [x] 3 `[agent]` Reframe oracle validation + `CONTEXT.md` — document the deliberate nesting divergence
  from `eslint-plugin-sonarjs` and the `??` alignment with the SonarSource paper; remove the "matches
  sonarjs exactly" claim; update any oracle spec so it no longer asserts linear parity.
- [x] 4 `[agent]` Write ADR 0005 (quadratic nesting + `??` exclusion) — rationale, calibration coupling,
  cross-reference to ADR 0004; add its index line to the root `CLAUDE.md` ADR list.
