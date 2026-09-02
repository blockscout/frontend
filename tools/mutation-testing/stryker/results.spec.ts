import { describe, expect, it, vi } from 'vitest';

import type { MutationReport } from './report';
import type { ResultSources } from './results';
import { chooseResults } from './results';
import type { StreamedRun } from './stream';

const COMPLETE_REPORT: MutationReport = { files: { 'src/complete.ts': { mutants: [] } } };
const STREAMED_RUN: StreamedRun = {
  report: { files: { 'src/streamed.ts': { mutants: [] } } },
  tested: 4,
  planned: 10,
};

function sources(): ResultSources {
  return {
    complete: vi.fn(() => COMPLETE_REPORT),
    streamed: vi.fn(() => STREAMED_RUN),
  };
}

describe('chooseResults', () => {
  it('reads Stryker\'s own report on a run that finished', () => {
    const readers = sources();

    expect(chooseResults({ truncated: false }, readers)).toEqual({ truncated: false, report: COMPLETE_REPORT });
    // The streaming path must change nothing on the normal path — including not being read.
    expect(readers.streamed).not.toHaveBeenCalled();
  });

  it('falls back to the streamed results on a truncated run, carrying how far it got', () => {
    const readers = sources();

    expect(chooseResults({ truncated: true }, readers)).toEqual({
      truncated: true,
      report: STREAMED_RUN.report,
      tested: 4,
      planned: 10,
    });
    // A truncated run wrote no json report at all, so reading one would throw.
    expect(readers.complete).not.toHaveBeenCalled();
  });
});
