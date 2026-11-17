import { describe, it, expect } from 'vitest';

import { parseHunkNewRanges, rangesOverlap } from './diff';

describe('parseHunkNewRanges', () => {
  it('reads new-side ranges from unified=0 hunk headers', () => {
    const diff = [
      'diff --git a/src/f.ts b/src/f.ts',
      '--- a/src/f.ts',
      '+++ b/src/f.ts',
      '@@ -10,0 +11,3 @@ some context',
      '+a',
      '+b',
      '+c',
      '@@ -20,2 +24 @@',
      '+x',
    ].join('\n');
    expect(parseHunkNewRanges(diff)).toEqual([ [ 11, 13 ], [ 24, 24 ] ]);
  });

  it('treats an omitted count as a single line', () => {
    expect(parseHunkNewRanges('@@ -1 +5 @@')).toEqual([ [ 5, 5 ] ]);
  });

  it('skips pure deletions (new-side count of 0)', () => {
    expect(parseHunkNewRanges('@@ -3,4 +2,0 @@')).toEqual([]);
  });

  it('ignores non-header lines', () => {
    expect(parseHunkNewRanges('not a hunk\n+added\n-removed')).toEqual([]);
  });
});

describe('rangesOverlap', () => {
  const ranges: Array<[ number, number ]> = [ [ 11, 13 ], [ 24, 24 ] ];

  it('is true when a function range contains a changed line', () => {
    expect(rangesOverlap(ranges, 5, 12)).toBe(true); // function spans lines 5..12, change at 11-13
  });

  it('is true when a changed range sits fully inside the function', () => {
    expect(rangesOverlap(ranges, 1, 30)).toBe(true);
  });

  it('is false when no changed line falls within the function', () => {
    expect(rangesOverlap(ranges, 14, 23)).toBe(false);
  });
});
