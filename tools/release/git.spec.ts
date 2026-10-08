import { describe, expect, it } from 'vitest';

import { parseLog } from './git';

describe('parseLog', () => {
  it('splits records into sha and full message', () => {
    const log = 'aaa\x1fAdd the badge (#10)\n\nBody line.\n\x1e\nbbb\x1fFix (#11)\n\n(cherry picked from commit ccc)\n\x1e\n';

    expect(parseLog(log)).toEqual([
      { sha: 'aaa', message: 'Add the badge (#10)\n\nBody line.' },
      { sha: 'bbb', message: 'Fix (#11)\n\n(cherry picked from commit ccc)' },
    ]);
  });

  it('reads an empty range as no commits', () => {
    expect(parseLog('')).toEqual([]);
  });
});
