import type { RunOutcome } from './invoke';
import type { MutationReport } from './report';
import { readReport } from './report';
import type { StreamedRun } from './stream';
import { readStream } from './stream';

// Where a run's results come from. A complete run reads Stryker's own json report untouched; only a
// run stopped at its budget falls back to the stream the reporter plugin appended to, and then
// carries how much of the selection it got through so the report cannot pass as a complete one.

export type RunResults =
  { readonly truncated: false; readonly report: MutationReport } |
  { readonly truncated: true; readonly report: MutationReport; readonly tested: number; readonly planned: number | null };

export interface ResultSources {
  readonly complete: () => MutationReport;
  readonly streamed: () => StreamedRun;
}

// Kept pure — the sources are thunks, so the choice is unit-testable and it is visible that a
// complete run never reads the stream, nor a truncated one a json report that was never written.
export function chooseResults(outcome: RunOutcome, sources: ResultSources): RunResults {
  if (!outcome.truncated) return { truncated: false, report: sources.complete() };

  const { report, tested, planned } = sources.streamed();
  return { truncated: true, report, tested, planned };
}

export function readResults(outcome: RunOutcome): RunResults {
  return chooseResults(outcome, { complete: readReport, streamed: readStream });
}
