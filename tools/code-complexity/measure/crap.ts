// CRAP (Change Risk Anti-Patterns) score: CRAP = c²·(1 − cov)³ + c, where c is the cyclomatic
// complexity and cov is the line-coverage fraction (0..1). Well-covered code scores near its
// complexity (cov = 1 gives exactly c); the cubic (1 − cov) term makes complex, untested code
// explode. At 0% coverage the score is c² + c. The cap it is measured against lives in ../config.ts.

export function crapScore(complexity: number, coverage: number): number {
  const uncovered = 1 - coverage;
  return complexity * complexity * uncovered * uncovered * uncovered + complexity;
}
