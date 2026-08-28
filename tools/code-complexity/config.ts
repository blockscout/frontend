// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate
// identically (spec FR12). CLI flags override these at runtime.
//
// All three caps were calibrated from a repo-wide run with optional chaining `?.` not counted
// (ADR 0004). They are coupled to that counting and to each other — re-tune them together against a
// fresh full-repo run, never one in isolation.

// Complexity is capped per function class (see ./CONTEXT.md). `jsx` functions — render bodies — get
// a deliberately high backstop: Playwright covers their rendering, so this cap exists only to catch
// genuinely oversized render bodies, and sits high enough that hitting it unambiguously means
// "decompose this". `behavior` functions — handlers, hooks, utils — get a tighter cap: this is where
// under-tested branchy logic hides.
export const DEFAULT_MAX_COMPLEXITY_JSX = 30;
export const DEFAULT_MAX_COMPLEXITY_BEHAVIOR = 12;

// The CRAP cap gates `behavior` functions only; `jsx` functions carry the complexity cap alone.
// At the 0%-coverage floor that dominates the tail, CRAP ≈ c²+c, so 80 flags untested behavior from
// complexity 9 up — pairing with the behavior cap of 12 to catch the 9–12 branchy-and-untested band
// without tripping on ordinary untested low-complexity code.
export const DEFAULT_MAX_CRAP = 80;

export const DEFAULT_BASE_REF = 'origin/main';
