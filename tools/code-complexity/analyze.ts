import { computeFunctionComplexities } from './complexity';
import type { FunctionComplexity } from './complexity';
import type { CoverageData } from './coverage';
import { functionLineCoverage } from './coverage';
import { crapScore } from './crap';
import type { ReportRow, Thresholds } from './report';

export type Gate = (fn: Pick<FunctionComplexity, 'startLine' | 'endLine'>) => boolean;

export interface BuildOptions {
  readonly thresholds: Thresholds;
  readonly gate: Gate;
  // Whether the CRAP (coverage) half applies to this file. A JSX-less logic file always qualifies;
  // a JSX component qualifies only when it has a co-located vitest spec (behavior tests exist),
  // since components without one are covered — if at all — by Playwright visual tests that produce
  // no vitest coverage, so scoring them would flag the whole component tree as untested.
  readonly coverageApplies: boolean;
  // How to score a qualifying file that is absent from the coverage report. Generated coverage and
  // the CI report pass `true`: absence means no spec executed the file, i.e. genuinely untested, so
  // it scores 0% (spec: missing coverage = 0%). A user-supplied --coverage-file in focused mode
  // passes `false`: the report may simply predate the file, so absence reports `—`/no CRAP.
  readonly missingCoverageIsZero: boolean;
}

// Joins the pieces into report rows for one file's source, applying both gates (spec FR2, FR3–FR6):
// the complexity cap runs on every gated function; the coverage-aware CRAP cap runs only where
// `coverageApplies`, and only when coverage for the file is available. `gate` decides which
// functions the thresholds apply to — focused/full gate all functions, diff gates only the ones a
// changed line falls within. This is a pure function (no fs/git) so both gates are unit-testable
// without a working tree.
export function buildFileRows(
  file: string,
  source: string,
  coverage: CoverageData | null,
  options: BuildOptions,
): Array<ReportRow> {
  const { thresholds, gate, coverageApplies, missingCoverageIsZero } = options;
  const functions = computeFunctionComplexities(source, file);

  const applyCoverage = coverage !== null && coverageApplies;
  const lineHits = applyCoverage ? coverage.lineHitsFor(file) : undefined;

  const coverageOf = (fn: FunctionComplexity): number | null => {
    if (!applyCoverage) return null;
    if (lineHits) return functionLineCoverage(lineHits, fn.startLine, fn.endLine);
    // File absent from the report: 0% only where a missing entry means "untested" (diff mode).
    return missingCoverageIsZero ? 0 : null;
  };

  return functions.map((fn) => {
    const gated = gate(fn);

    const coverageFraction = coverageOf(fn);
    const crap = coverageFraction === null ? null : crapScore(fn.complexity, coverageFraction);

    return {
      file,
      line: fn.startLine,
      name: fn.name,
      complexity: fn.complexity,
      coverage: coverageFraction,
      crap,
      brokeComplexity: gated && fn.complexity > thresholds.maxComplexity,
      brokeCrap: gated && crap !== null && crap > thresholds.maxCrap,
    };
  });
}
