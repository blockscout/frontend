// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate
// identically (spec FR12). CLI flags override these at runtime.
//
// The caps were calibrated from a repo-wide run under the exact CC model ADR 0005 describes:
// optional chaining and null-coalescing not counted (ADR 0004, 0005), nesting charged `1 + n²`.
// They are coupled to that model and to each other — changing either increment rule invalidates
// these numbers, so re-tune them together against a fresh full-repo run, never one in isolation.

// The readability gate is Cognitive Complexity (CC), capped per function class (see ./CONTEXT.md).
// `jsx` functions — render bodies — get a deliberately high backstop: Playwright covers their
// rendering, so this cap exists only to catch genuinely oversized render bodies, and sits high enough
// that hitting it unambiguously means "decompose this". `behavior` functions — handlers, hooks, utils
// — get a tighter cap: this is where hard-to-read, under-tested logic hides. Under the quadratic
// model flat breadth accrues at +1 per decision and stays put while nesting accelerates away, so a
// single cap can forgive wide-but-shallow code and still catch the genuinely-nested tail.
//
// Calibrated from a full-repo CC run (behavior n=4273, p99=10, max 43; jsx n=2265, p99=20, max 92):
//  - BEHAVIOR 20: the natural gap in the distribution — the flat-breadth band tops out at 20 and the
//    genuinely-nested band starts at 21. Fires on 8, of which 7 climbed under the quadratic penalty
//    (nesting depth ≥ 2). The deep-nested case the gate was built to catch trips at 23, with margin,
//    where the linear model scored it 15 and could only reach it by also catching the flat 18s.
//    Tightening to 18 re-catches those false positives; loosening to 22 drops a nested 21.
//  - JSX 25: a monster-render-body backstop, re-confirmed against this run (the quadratic change
//    barely moves the jsx tail: p99 19→20, max 89→92). Fires on the 16 most oversized render bodies
//    (CC ≥ 26). The jsx tail has no elbow, so this sits on a smooth shoulder — a judgment call about
//    where "decompose this" starts, not a gap in the data.
//
// Against the retired cyclomatic gate (behavior cx > 12 fired on 33, jsx cx > 30 on 10; total 43),
// the two caps fire on 24 — net-looser overall, though jsx is per-kind stricter (16 vs 10).
// Wide-but-shallow logic the old count over-flagged now clears: the three biggest rescues dropped
// from cyclomatic 18/14/15 to CC 6/2/0.
export const DEFAULT_MAX_COGNITIVE_JSX = 25;
export const DEFAULT_MAX_COGNITIVE_BEHAVIOR = 20;

// The CRAP cap gates `behavior` functions only via cyclomatic complexity `c` (CC never feeds CRAP).
// At the 0%-coverage floor that dominates the tail, CRAP ≈ c²+c, so 80 flags untested behavior from
// cyclomatic 9 up — catching branchy-and-untested logic without tripping on ordinary untested
// low-complexity code.
export const DEFAULT_MAX_CRAP = 80;

export const DEFAULT_BASE_REF = 'origin/main';
