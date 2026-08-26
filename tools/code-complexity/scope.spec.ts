import { describe, it, expect } from 'vitest';

import { isInScope, resolveScopedFiles } from './scope';

describe('isInScope', () => {
  it('includes src .ts and .tsx files', () => {
    expect(isInScope('src/lib/foo.ts')).toBe(true);
    expect(isInScope('src/ui/Button.tsx')).toBe(true);
  });

  it('excludes files outside src/', () => {
    expect(isInScope('tools/code-complexity/index.ts')).toBe(false);
    expect(isInScope('deploy/scripts/run.ts')).toBe(false);
    expect(isInScope('vitest/setup.ts')).toBe(false);
  });

  it('excludes non-ts/tsx files', () => {
    expect(isInScope('src/lib/data.json')).toBe(false);
    expect(isInScope('src/lib/styles.css')).toBe(false);
  });

  it('excludes spec and Playwright test/story files', () => {
    expect(isInScope('src/lib/foo.spec.ts')).toBe(false);
    expect(isInScope('src/ui/Button.spec.tsx')).toBe(false);
    expect(isInScope('src/ui/Button.pw.tsx')).toBe(false);
    expect(isInScope('src/ui/Button.pwstory.tsx')).toBe(false);
  });

  it('excludes declaration files', () => {
    expect(isInScope('src/types/global.d.ts')).toBe(false);
  });

  it('excludes the toolkit build output', () => {
    expect(isInScope('src/toolkit/package/dist/index.ts')).toBe(false);
    // but toolkit source itself stays in scope
    expect(isInScope('src/toolkit/components/Button.tsx')).toBe(true);
  });
});

describe('resolveScopedFiles', () => {
  it('keeps only the in-scope paths', () => {
    const input = [
      'src/a.ts',
      'src/a.spec.ts',
      'tools/b.ts',
      'src/c.tsx',
      'src/d.d.ts',
    ];
    expect(resolveScopedFiles(input)).toEqual([ 'src/a.ts', 'src/c.tsx' ]);
  });
});
