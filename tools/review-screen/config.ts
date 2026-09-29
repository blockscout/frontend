// The model is pinned so every sidecar in a pilot is comparable; the response's own `model` field is
// what the sidecar records.
export const MODEL = 'jev-1.13.0';

export const DEFAULT_STANDARDS_THRESHOLD = 0.7;
export const STANDARDS_THRESHOLD_OVERRIDES: Readonly<Record<string, number>> = {
  // Real breaches of this rule score in the low 0.6s, where the other rules only produce noise.
  'inline-empty-default': 0.6,
};
// The spec grid asks "does this file address the requirement", so a requirement is a suspect when
// its best score stays *below* this.
export const SPEC_THRESHOLD = 0.7;
// The task folder describes the requirements rather than implementing them, so its files would score
// every requirement high and hide the real gaps; the spec grid never sees them.
export const SPEC_GRID_EXCLUDE = '.agents/tasks/**';
// One cap for both grids, split evenly when both overflow.
export const MAX_SUSPECTS = 12;

export const DEFAULT_BASE_BRANCH = 'main';

// Lines of unchanged code kept around each hunk (`git diff -U<n>`).
export const CONTEXT_LINES = 3;

// The SDK exposes no token counter, so the window budget is in characters: ~100k chars ≈ 25k tokens,
// under the model's 32k limit for state plus the longest question.
export const MAX_STATE_CHARS = 100_000;

// A `choice` question takes at most 255 options, and the locate call offers one per changed line.
export const MAX_CHANGED_LINES_PER_WINDOW = 255;

export const CONCURRENT_REQUESTS = 4;

export const SIDECAR_DIR = '.ai/jev';
