export function crapScore(complexity: number, coverage: number): number {
  const uncovered = 1 - coverage;
  return complexity * complexity * uncovered * uncovered * uncovered + complexity;
}
