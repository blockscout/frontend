import type { CoverageData } from './coverage/read';
import { functionLineCoverage } from './coverage/read';
import { computeFunctionComplexities } from './measure/complexity';
import type { FunctionComplexity } from './measure/complexity';
import { crapScore } from './measure/crap';
import type { FunctionKind, ReportRow, Thresholds } from './render/report';
import { maxCognitiveFor } from './render/report';

export type Gate = (fn: Pick<FunctionComplexity, 'startLine' | 'endLine'>) => boolean;

export interface BuildOptions {
  readonly thresholds: Thresholds;
  readonly gate: Gate;
  // How to score a `behavior` function absent from the coverage report: `true` reads absence as
  // "no spec executed it" (0%), `false` as "no data" (`—`). Which mode passes which, and why:
  // ./docs/MODEL.md.
  readonly missingCoverageIsZero: boolean;
}

// Joins the pieces into report rows for one file's source, applying both gates per function.
// `gate` decides which functions the thresholds apply to — focused/full gate all functions, diff
// gates only the ones a changed line falls within. Kept pure (no fs/git) so both gates are
// unit-testable without a working tree.
export function buildFileRows(
  file: string,
  source: string,
  coverage: CoverageData | null,
  options: BuildOptions,
): Array<ReportRow> {
  const { thresholds, gate, missingCoverageIsZero } = options;
  const functions = computeFunctionComplexities(source, file);

  const lineHits = coverage !== null ? coverage.lineHitsFor(file) : undefined;

  // CRAP applies only to `behavior` functions, and only when coverage data exists at all.
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
