import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { Selection, SelectionRequest } from './files';
import { selectFiles } from './files';

// Real repo files, so eligibility is exercised against the naming convention on disk rather than a
// stubbed fs: crap.spec.ts sits beside the first, nothing sits beside the second.
const ELIGIBLE_FILE = 'tools/code-complexity/measure/crap.ts';
const INELIGIBLE_FILE = 'tools/code-complexity/config.ts';

const BASE_REF = 'main';

function request(overrides: Partial<SelectionRequest>): Selection {
  return selectFiles({ focusPaths: [], diffSelected: false, baseRef: BASE_REF, ...overrides });
}

describe('focused mode', () => {
  it('selects the given files and separates the ones with no spec beside them', () => {
    expect(request({ focusPaths: [ ELIGIBLE_FILE, INELIGIBLE_FILE ] })).toEqual({
      outcome: 'selected',
      files: [ ELIGIBLE_FILE ],
      ineligible: [ INELIGIBLE_FILE ],
    });
  });

  it('strips a leading ./ so a shell-completed path matches the diff paths', () => {
    expect(request({ focusPaths: [ `./${ ELIGIBLE_FILE }` ] })).toMatchObject({ files: [ ELIGIBLE_FILE ] });
  });

  it('is empty when no given file has a spec beside it', () => {
    expect(request({ focusPaths: [ INELIGIBLE_FILE ] })).toEqual({
      outcome: 'empty',
      reason: 'No given file has a co-located vitest spec — nothing to mutate.',
    });
  });

  it('rejects a path that does not exist', () => {
    expect(() => request({ focusPaths: [ 'src/nope.ts' ] })).toThrow('No such file: src/nope.ts');
  });

  it('takes the given paths even when --changed is also set', () => {
    expect(request({ focusPaths: [ ELIGIBLE_FILE ], diffSelected: true })).toMatchObject({ files: [ ELIGIBLE_FILE ] });
  });
});

// The git-backed modes run against a throwaway repository, so the assertions do not depend on what
// this branch happens to have changed.
describe('git-backed modes', () => {
  const originalCwd = process.cwd();
  let repo: string | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (repo) fs.rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  function git(...args: Array<string>): void {
    execFileSync('git', [ '-c', 'user.email=t@t.t', '-c', 'user.name=t', ...args ], { stdio: 'ignore' });
  }

  function write(filePath: string, body: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, body);
  }

  // A repo forked from `main`, with one commit on each side of the fork point:
  //   main:    src/base.ts (+spec), then src/landed-later.ts (+spec) after the fork
  //   feature: src/touched.ts (+spec), src/untested.ts (no spec), src/notes.md (out of scope)
  function createForkedRepo(): void {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'mutation-select-'));
    process.chdir(repo);
    git('init', '-b', BASE_REF);

    write('src/base.ts', 'export const base = 1;\n');
    write('src/base.spec.ts', 'export const spec = 1;\n');
    git('add', '.');
    git('commit', '-m', 'base');

    git('checkout', '-b', 'feature');
    write('src/touched.ts', 'export const touched = 1;\n');
    write('src/touched.spec.ts', 'export const spec = 1;\n');
    write('src/untested.ts', 'export const untested = 1;\n');
    write('src/notes.md', 'notes\n');
    git('add', '.');
    git('commit', '-m', 'feature');

    git('checkout', BASE_REF);
    write('src/landed-later.ts', 'export const landedLater = 1;\n');
    write('src/landed-later.spec.ts', 'export const spec = 1;\n');
    git('add', '.');
    git('commit', '-m', 'landed later');

    git('checkout', 'feature');
  }

  it('selects only the eligible files the branch itself touched', () => {
    createForkedRepo();
    expect(request({ diffSelected: true })).toEqual({
      outcome: 'selected',
      files: [ 'src/touched.ts' ],
      ineligible: [],
    });
  });

  it('honours an explicit base ref', () => {
    createForkedRepo();
    git('branch', 'other-base', BASE_REF);
    expect(request({ diffSelected: true, baseRef: 'other-base' })).toMatchObject({ files: [ 'src/touched.ts' ] });
  });

  it('picks up an uncommitted edit to an eligible file', () => {
    createForkedRepo();
    write('src/base.ts', 'export const base = 2;\n');
    expect(request({ diffSelected: true })).toMatchObject({ files: [ 'src/base.ts', 'src/touched.ts' ] });
  });

  it('is empty on the base branch itself, naming the ref', () => {
    createForkedRepo();
    git('checkout', BASE_REF);
    expect(request({ diffSelected: true })).toEqual({
      outcome: 'empty',
      reason: `No source file in scope changed vs ${ BASE_REF } — nothing to mutate.`,
    });
  });

  it('is empty when the changed files have no specs beside them', () => {
    createForkedRepo();
    git('checkout', '-b', 'untested-only', BASE_REF);
    write('src/lonely.ts', 'export const lonely = 1;\n');
    git('add', '.');
    git('commit', '-m', 'untested');
    expect(request({ diffSelected: true })).toEqual({
      outcome: 'empty',
      reason: `No file changed vs ${ BASE_REF } has a co-located vitest spec — nothing to mutate.`,
    });
  });

  it('drops a file the branch deleted', () => {
    createForkedRepo();
    git('rm', 'src/base.ts', 'src/base.spec.ts');
    git('commit', '-m', 'delete base');
    expect(request({ diffSelected: true })).toMatchObject({ files: [ 'src/touched.ts' ] });
  });

  it('selects every eligible in-scope file when invoked bare', () => {
    createForkedRepo();
    expect(request({})).toEqual({
      outcome: 'selected',
      files: [ 'src/base.ts', 'src/touched.ts' ],
      ineligible: [],
    });
  });
});
