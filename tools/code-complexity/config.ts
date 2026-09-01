// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate identically.
// CLI flags override these at runtime.
//
// All three caps are calibrated, and coupled — to each other and to the counting model in
// ./SCORING.md. Changing one in isolation, or changing an increment rule, silently makes the rest
// wrong. Raising a cap to unblock a PR is not a fix. The distribution behind each number and the
// procedure for deriving them again are in ./CALIBRATION.md.

// The readability gate: cognitive complexity, capped per function class — `jsx` render bodies get a
// high backstop, `behavior` logic a tighter cap. Why the classes gate differently: ./CONTEXT.md.
export const DEFAULT_MAX_COGNITIVE_JSX = 25;
export const DEFAULT_MAX_COGNITIVE_BEHAVIOR = 20;

// The under-testedness gate: `behavior` functions only, from cyclomatic complexity joined with
// coverage. CC never feeds CRAP.
export const DEFAULT_MAX_CRAP = 80;

export const DEFAULT_BASE_REF = 'origin/main';
