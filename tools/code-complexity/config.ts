// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate
// identically (spec FR12). CLI flags override these at runtime.
//
// The caps were calibrated from a repo-wide run with optional chaining `?.` not counted (ADR 0004).
// They are coupled to that counting and to each other — re-tune them together against a fresh
// full-repo run, never one in isolation.

// The readability gate is Cognitive Complexity (CC), capped per function class (see ./CONTEXT.md).
// `jsx` functions — render bodies — get a deliberately high backstop: Playwright covers their
// rendering, so this cap exists only to catch genuinely oversized render bodies, and sits high enough
// that hitting it unambiguously means "decompose this". `behavior` functions — handlers, hooks, utils
// — get a tighter cap: this is where hard-to-read, under-tested logic hides. CC scores flat control
// flow cheap (a wide switch or if-ladder is ~1) and penalises nesting, so these caps isolate the
// genuinely-nested tail and clear the wide-but-shallow code the retired cyclomatic cap over-flagged.
//
// Calibrated from a full-repo CC run (behavior n=4273, p99=10; jsx n=2265, p99=20):
//  - BEHAVIOR 14: the loosest cap that still trips the deep-nested tail the gate targets (e.g.
//    useEtherscanRedirects, CC 15). Fires on 20 behavior functions vs the retired cyclomatic cap's 33
//    — net-looser — while wide-but-shallow logic that the old count over-flagged now clears
//    (getItemCategory cyclomatic 18 → CC 6, variableToPlainText 14 → 3).
//  - JSX 25: a monster-render-body backstop, catching the 15 most oversized/nested render bodies
//    (CC ≥ 26). Overall the two caps fire on 35 functions vs the retired 43 — net-looser.
export const DEFAULT_MAX_COGNITIVE_JSX = 25;
export const DEFAULT_MAX_COGNITIVE_BEHAVIOR = 14;

// The CRAP cap gates `behavior` functions only via cyclomatic complexity `c` (CC never feeds CRAP).
// At the 0%-coverage floor that dominates the tail, CRAP ≈ c²+c, so 80 flags untested behavior from
// cyclomatic 9 up — catching branchy-and-untested logic without tripping on ordinary untested
// low-complexity code.
export const DEFAULT_MAX_CRAP = 80;

export const DEFAULT_BASE_REF = 'origin/main';
