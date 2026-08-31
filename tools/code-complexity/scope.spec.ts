import { describe, it, expect } from 'vitest';

import { isInScope, resolveScopedFiles } from './scope';

describe('isInScope', () => {
  it('includes src .ts and .tsx files', () => {
    expect(isInScope('src/lib/foo.ts')).toBe(true);
    expect(isInScope('src/ui/Button.tsx')).toBe(true);
  });

  it('includes the repo tooling under tools/', () => {
    expect(isInScope('tools/code-complexity/index.ts')).toBe(true);
    expect(isInScope('tools/dev-server/fetch.ts')).toBe(true);
    expect(isInScope('tools/profiling/aggregate-react-profile.mjs')).toBe(true);
  });

  it('includes the plain-JS extensions', () => {
    expect(isInScope('src/server/redirects.js')).toBe(true);
    expect(isInScope('tools/scripts/check-doc-links.mjs')).toBe(true);
    expect(isInScope('tools/scripts/legacy.cjs')).toBe(true);
  });

  it('excludes deploy/ — it is outside ESLint and the root tsconfig (issue #3675)', () => {
    expect(isInScope('deploy/scripts/run.ts')).toBe(false);
    expect(isInScope('deploy/tools/envs-validator/index.ts')).toBe(false);
  });

  it('excludes test support and configuration', () => {
    expect(isInScope('playwright/TestApp.tsx')).toBe(false);
    expect(isInScope('vitest/setup.ts')).toBe(false);
    expect(isInScope('src/toolkit/package/vite.config.ts')).toBe(false);
    expect(isInScope('tools/code-complexity/vitest.config.ts')).toBe(false);
  });

  it('excludes everything outside the two allowlisted roots', () => {
    expect(isInScope('proxy.ts')).toBe(false);
    expect(isInScope('instrumentation.ts')).toBe(false);
    expect(isInScope('docs/example.ts')).toBe(false);
  });

  it('excludes non-source extensions', () => {
    expect(isInScope('src/lib/data.json')).toBe(false);
    expect(isInScope('src/lib/styles.css')).toBe(false);
    expect(isInScope('tools/code-complexity/run.sh')).toBe(false);
  });

  it('excludes spec and Playwright test/story files', () => {
    expect(isInScope('src/lib/foo.spec.ts')).toBe(false);
    expect(isInScope('src/ui/Button.spec.tsx')).toBe(false);
    expect(isInScope('src/ui/Button.pw.tsx')).toBe(false);
    expect(isInScope('src/ui/Button.pwstory.tsx')).toBe(false);
    expect(isInScope('tools/code-complexity/scope.spec.ts')).toBe(false);
  });

  it('excludes declaration files', () => {
    expect(isInScope('src/types/global.d.ts')).toBe(false);
  });

  it('excludes build output', () => {
    expect(isInScope('src/toolkit/package/dist/index.ts')).toBe(false);
    expect(isInScope('tools/code-complexity/dist/index.js')).toBe(false);
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
      'deploy/c.ts',
      'src/c.tsx',
      'src/d.d.ts',
    ];
    expect(resolveScopedFiles(input)).toEqual([ 'src/a.ts', 'tools/b.ts', 'src/c.tsx' ]);
  });
});
