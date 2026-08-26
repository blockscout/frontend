// Gate thresholds and defaults live here, not in CI, so a local run and a CI run gate
// identically (spec FR12). CLI flags override these at runtime.
//
// The complexity cap is provisional; ticket 04 calibrates it from the repo-wide distribution
// before the gate is turned on.

export const DEFAULT_MAX_COMPLEXITY = 20;

export const DEFAULT_BASE_REF = 'origin/main';
