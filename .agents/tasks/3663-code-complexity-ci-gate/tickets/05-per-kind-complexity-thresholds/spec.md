# 05 — Per-kind complexity caps (`jsx` vs `behavior`) and per-function CRAP

| | |
| --- | --- |
| Parent spec | `../../spec.md`, ticket 05 of #3663 |
| Blocked by | T04 |

## What to build

Split the single raw-complexity cap into **two caps keyed off one per-function property — "does this
function directly contain JSX?"** — and let that same property drive CRAP applicability. Today one
`DEFAULT_MAX_COMPLEXITY` gates every function, which makes the cap behave as a "large-component
detector": component render bodies (dominated by conditional JSX) share a population with hooks and
utils, so a cap loose enough for a page component lets genuinely branchy logic through, and one tight
enough for a util nags every composite component.

A function is classified **`jsx`** when JSX appears in its own body outside any nested function, else
**`behavior`** (event handlers, `useCallback`/`useMemo` bodies, hooks, utils — wherever they live,
including nested inside a component). Because the tool already scores every function in isolation
(a branch accrues to the innermost enclosing function), a component's render body is already just its
own JSX-level control flow; its handlers are separate `behavior` units. The two classes gate
differently:

- **`jsx`** → the `jsx` complexity cap only, **no CRAP**. It is a conservative monster-backstop:
  Playwright covers the rendering, so this cap exists only to catch genuinely oversized render bodies
  (`TxDetails` 120, `BlockDetails` 85), and is set high enough that hitting it unambiguously means
  "decompose this". Lowering it further would push people toward condition-swallowing refactors, so
  it stays high on purpose.
- **`behavior`** → the `behavior` complexity cap **and** CRAP. This is where under-tested logic hides
  and where neither Playwright nor (often) vitest covers it, so it carries both gates and the tighter
  complexity cap.

This replaces the current *file-level* CRAP-applicability rule ("JSX-less file, or JSX file with a
co-located spec") with a *per-function* one: every `behavior` function is CRAP-scored, every `jsx`
function is not — so a spec'd component's render loses its (noise) CRAP score while its handlers gain
a real one, and a spec-less component's handlers are scored at 0% (Playwright emits no vitest
coverage — an accurate "no unit test exercises this" signal), without any change to which files
trigger a vitest run.

## Acceptance criteria

How to verify: `pnpm test:code-complexity` (full-repo report) and `pnpm test:code-complexity src/slices/tx/pages/details/info/TxDetails.tsx --no-coverage`.

- [ ] A function's class is decided by direct-JSX (JSX in its own body, not reached through a nested
      function): `TxDetails` and an inline `.map(x => <Row/>)` callback both classify `jsx`; an
      `onClick`/`useCallback` body and a `useX` hook classify `behavior`. Unit-tested.
- [ ] Two independent complexity caps gate: `jsx` functions against the `jsx` cap, `behavior`
      functions against the `behavior` cap. `config.ts` exposes both defaults; `--max-complexity-jsx`
      / `--max-complexity-behavior` override them and bare `--max-complexity <n>` sets both.
- [ ] CRAP is scored on every `behavior` function and on no `jsx` function, regardless of the file's
      extension or whether it has a co-located spec. A `behavior` function in a JSX component with no
      co-located spec scores 0% (missing-coverage-is-zero), and the set of files that trigger a vitest
      run is unchanged. The CRAP cap stays single.
- [ ] The report gains a `KIND` column (`jsx` / `behavior`); the `BROKE` column still names the cap
      crossed; the table still sorts by CRAP descending. All existing unit tests updated to the new
      config/report shape and passing.
- [ ] `(human)` The two complexity caps and the CRAP cap are set from a fresh full-repo distribution,
      biased `jsx` conservative/high and `behavior` aggressive/low, flagging a small defensible tail
      rather than a flood — the choice justified against the tail in `notes.md`.
- [ ] `CONTEXT.md` documents the per-function `jsx`/`behavior` rule for **both** gates, superseding
      the file-level CRAP-applicability section; ADR 0004 carries a one-line pointer so it no longer
      reads as a single-cap gate.

## Details

- **Classifier — reuse the existing walk.** `computeFunctionComplexities` (`complexity.ts`) already
  keeps a stack of enclosing functions and attributes each branch to the innermost frame. Add a
  `containsJsx` flag to that frame set the same way: when a `JsxElement` / `JsxSelfClosingElement` /
  `JsxFragment` node is visited and the stack is non-empty, mark the **innermost** frame — that frame
  is by construction the function whose own body contains the JSX (a nested function would be the
  innermost). This yields "directly contains JSX" for free; no second AST pass, no change to
  `jsx.ts`'s file-level `fileContainsJsx` (which stays as-is for the vitest-run decision). `KIND` =
  `containsJsx ? 'jsx' : 'behavior'`.
- **Config / CLI.** Replace `DEFAULT_MAX_COMPLEXITY` with `DEFAULT_MAX_COMPLEXITY_JSX` and
  `DEFAULT_MAX_COMPLEXITY_BEHAVIOR`; keep `DEFAULT_MAX_CRAP` single. The `Thresholds` type
  (`report.ts`) carries both complexity caps. CLI parsing (`index.ts`): add `--max-complexity-jsx`
  / `--max-complexity-behavior`; keep `--max-complexity <n>` as a global that sets both. CI passes no
  numbers (FR12) — unchanged.
- **Gate routing (`analyze.ts`).** The gate is per-function: pick the complexity cap by the
  function's class, and apply CRAP only to `behavior` functions. This retires the file-level
  `coverageApplies` as the CRAP switch; the file-level notion survives only as *"does this file need
  vitest coverage generated"* = JSX-less file **or** JSX file with a co-located spec (the current set,
  unchanged — so `generate-coverage.ts` scope and its primed-spec exclusion are untouched). A
  `behavior` function in a JSX file absent from that set scores 0% via the existing
  `missingCoverageIsZero` path without triggering a vitest run; the focused user-supplied
  `--coverage-file` "`—`/no data" exception is preserved.
- **Numbers (deferred to the `(human)` leaf).** Starting points from the T04-era study, `?.` not
  counted: `jsx` ≈ 25 (willing to go 30 — backstop only; flags ~16, all genuine monsters),
  `behavior` ≤ 15 with intent to push lower (flags ~18 — real branchy logic), CRAP unchanged unless
  the new `behavior` population shifts the tail. Calibrate against a fresh full-repo run before
  setting — the caps are coupled to the `?.` decision (ADR 0004) and to each other.
- **No new ADR.** This is a scope/calibration refinement (functions inside components brought into
  the CRAP population), not an architectural reversal — decided with the developer during scoping.

## Skill inputs

None — no project skill applies to this ticket (bespoke tooling under `tools/code-complexity/`).

## Leaf worklist

- [ ] 1 `[agent]` Per-function JSX classifier: extend the `complexity.ts` walk to emit `containsJsx`
      per function; unit-test direct-JSX vs nested-function boundary (render, inline `.map` render,
      handler, hook, JSX-less `.tsx` hook)
- [ ] 2 `[agent]` Config + CLI: two complexity caps in `config.ts`, `Thresholds` shape, `index.ts`
      flag parsing (`--max-complexity-jsx` / `--max-complexity-behavior`, bare `--max-complexity`
      clamps both), usage block in `CONTEXT.md`
- [ ] 3 `[agent]` Gate routing in `analyze.ts`: per-function cap selection and per-function CRAP
      applicability (`behavior` only; 0% fallback for spec-less JSX files with no vitest run); `KIND`
      column in `report.ts`; update affected unit tests
- [ ] 4 `[agent]` Full-repo distribution run producing the `jsx` and `behavior` complexity
      distributions and the CRAP distribution under the new per-function applicability
- [ ] 5 `[human]` Choose the `jsx` cap (conservative/high), `behavior` cap (aggressive/low) and CRAP
      cap from the distribution; set them in `config.ts`
- [ ] 6 `[agent]` Docs: rewrite the CRAP-applicability section of `CONTEXT.md` to the per-function
      rule for both gates; add the one-line pointer to ADR 0004's Consequences; record the
      calibration evidence (distributions + chosen numbers) in the ticket's `notes.md`
