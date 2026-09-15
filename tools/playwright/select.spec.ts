import { describe, expect, it } from 'vitest';

import { selectMode } from './select';

describe('selectMode', () => {
  it('delegates to --only-changed when nothing on the force-full list changed', () => {
    expect(selectMode([ 'src/ui/Foo.tsx', 'src/ui/Foo.pw.tsx' ])).toEqual({ kind: 'only-changed' });
  });

  it('delegates to --only-changed on an empty diff', () => {
    expect(selectMode([])).toEqual({ kind: 'only-changed' });
  });

  it.each([
    [ 'an icon', 'src/sprite/icons/arrows/east.svg' ],
    [ 'a harness file', 'playwright/index.html' ],
    [ 'the playwright config', 'playwright-ct.config.ts' ],
    [ 'the lockfile', 'pnpm-lock.yaml' ],
  ])('forces a full run when %s changed', (_, file) => {
    expect(selectMode([ 'src/ui/Foo.tsx', file ])).toEqual({ kind: 'full', forcedBy: file });
  });

  // An exact-path entry must not act as a prefix, and a directory entry must not match a sibling
  // that merely starts with the same characters.
  it('matches exact-path entries exactly and directory entries by prefix', () => {
    expect(selectMode([ 'playwright-ct.config.ts.bak', 'pnpm-lock.yaml.orig' ])).toEqual({ kind: 'only-changed' });
    expect(selectMode([ 'playwright-results/report.json' ])).toEqual({ kind: 'only-changed' });
    expect(selectMode([ 'src/sprite/iconsList.ts' ])).toEqual({ kind: 'only-changed' });
  });

  it('names the first forcing file when several changed', () => {
    expect(selectMode([ 'pnpm-lock.yaml', 'src/sprite/icons/a.svg' ])).toEqual({ kind: 'full', forcedBy: 'pnpm-lock.yaml' });
  });
});
