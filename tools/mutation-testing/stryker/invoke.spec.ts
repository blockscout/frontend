import { describe, expect, it } from 'vitest';

import { formatMutateTargets } from './invoke';

describe('formatMutateTargets', () => {
  it('emits one entry per range, so Stryker unions them per file', () => {
    expect(formatMutateTargets([ { file: 'src/util.ts', ranges: [ [ 1, 4 ], [ 9, 9 ] ] } ]))
      .toEqual([ 'src/util.ts:1-4', 'src/util.ts:9-9' ]);
  });

  // Stryker refuses a mutation range on a pattern it reads as a glob, which a Next.js route file is.
  it('escapes glob metacharacters in the path', () => {
    expect(formatMutateTargets([ { file: 'src/pages/tx/[hash].tsx', ranges: [ [ 2, 3 ] ] } ]))
      .toEqual([ 'src/pages/tx/\\[hash\\].tsx:2-3' ]);
  });

  // A backslash left as-is would be read as escaping the next character instead of as itself.
  it('escapes a backslash in the path', () => {
    expect(formatMutateTargets([ { file: 'src/a\\b.ts', ranges: [ [ 1, 1 ] ] } ]))
      .toEqual([ 'src/a\\\\b.ts:1-1' ]);
  });
});
