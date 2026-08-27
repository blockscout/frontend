import { describe, it, expect } from 'vitest';

import { vitestSelectionArgs } from './generate-coverage';

describe('vitestSelectionArgs', () => {
  it('scopes to the given files in focused mode via `related --run`', () => {
    const args = vitestSelectionArgs({ mode: 'related', paths: [ 'src/a.ts', 'src/b.ts' ] });
    expect(args).toEqual([ 'related', 'src/a.ts', 'src/b.ts', '--run' ]);
  });

  it('runs the affected specs since the base commit in diff mode', () => {
    const args = vitestSelectionArgs({ mode: 'changed', since: 'abc123' });
    expect(args).toEqual([ 'run', '--changed=abc123' ]);
  });

  it('runs the whole suite in full-repo mode', () => {
    expect(vitestSelectionArgs({ mode: 'full' })).toEqual([ 'run' ]);
  });
});
