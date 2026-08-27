// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate
// identically (spec FR12). CLI flags override these at runtime.
//
// Both caps were calibrated from a repo-wide run with optional chaining `?.` not counted (ADR 0004):
// the complexity cap targets the far tail of per-function cyclomatic complexity, and the CRAP cap is
// set so a well-covered function clears it while a complex, untested one does not. They are coupled
// to that counting and to each other — re-tune both together against a fresh full-repo run, never
// one in isolation.

export const DEFAULT_MAX_COMPLEXITY = 20;

// The CRAP cap gates JSX-less (logic) files only; JSX files keep the complexity cap alone.
export const DEFAULT_MAX_CRAP = 50;

export const DEFAULT_BASE_REF = 'origin/main';
