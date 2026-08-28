import { computeFunctionComplexities } from './complexity';
import type { FunctionComplexity } from './complexity';
import type { CoverageData } from './coverage';
import { functionLineCoverage } from './coverage';
import { crapScore } from './crap';
import type { FunctionKind, ReportRow, Thresholds } from './report';
import { maxCognitiveFor } from './report';

export type Gate = (fn: Pick<FunctionComplexity, 'startLine' | 'endLine'>) => boolean;

export interface BuildOptions {
  readonly thresholds: Thresholds;
  readonly gate: Gate;
  // How to score a `behavior` function absent from the coverage report. Generated coverage and the
  // CI report pass `true`: absence means no spec executed the file, i.e. genuinely untested, so it
  // scores 0% (spec: missing coverage = 0%). A user-supplied --coverage-file in focused mode passes
  // `false`: the report may simply predate the file, so absence reports `—`/no CRAP.
  readonly missingCoverageIsZero: boolean;
}

// Joins the pieces into report rows for one file's source, applying both gates per function (spec
// FR2, FR3–FR6). Classification is per function: a `jsx` function (JSX directly in its own body)
// gets the `jsx` cognitive cap and no CRAP; a `behavior` function gets the `behavior` cap and the
// coverage-aware CRAP cap. `gate` decides which functions the thresholds apply to — focused/full
// gate all functions, diff gates only the ones a changed line falls within. This is a pure function
// (no fs/git) so both gates are unit-testable without a working tree.
export function buildFileRows(
  file: string,
  source: string,
  coverage: CoverageData | null,
  options: BuildOptions,
): Array<ReportRow> {
  const { thresholds, gate, missingCoverageIsZero } = options;
  const functions = computeFunctionComplexities(source, file);

  const lineHits = coverage !== null ? coverage.lineHitsFor(file) : undefined;

  // CRAP applies only to `behavior` functions, and only when coverage data exists at all. A `jsx`
  // function never scores CRAP (Playwright covers rendering; vitest coverage is not its signal).
  const coverageOf = (fn: FunctionComplexity): number | null => {
    if (fn.containsJsx || coverage === null) return null;
    if (lineHits) return functionLineCoverage(lineHits, fn.startLine, fn.endLine);
    // File absent from the report: 0% only where a missing entry means "untested" (diff/CI).
    return missingCoverageIsZero ? 0 : null;
  };

  return functions.map((fn) => {
    const gated = gate(fn);
    const kind: FunctionKind = fn.containsJsx ? 'jsx' : 'behavior';

    const coverageFraction = coverageOf(fn);
    const crap = coverageFraction === null ? null : crapScore(fn.complexity, coverageFraction);

    return {
      file,
      line: fn.startLine,
      name: fn.name,
      kind,
      complexity: fn.complexity,
      cognitive: fn.cognitive,
      contributions: fn.contributions,
      coverage: coverageFraction,
      crap,
      brokeCognitive: gated && fn.cognitive > maxCognitiveFor(kind, thresholds),
      brokeCrap: gated && crap !== null && crap > thresholds.maxCrap,
    };
  });
}
