import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { RepoIndex } from './resolve';
import { buildRepoIndex, headingSlugs, isPlaceholder, nearby, resolves, shorthandFor, slugify } from './resolve';

const TRACKED = [
  'package.json',
  'src/api/types.ts',
  'src/toolkit/theme/theme.ts',
  'src/slices/token/types/api.ts',
  'src/slices/block/types/api.ts',
  '.agents/AGENTS.md',
];

let root: string;
let repo: RepoIndex;

function write(rel: string, body = ''): string {
  const absPath = path.join(root, rel);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, body);
  return absPath;
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-links-')));
  repo = buildRepoIndex(root, TRACKED);
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('buildRepoIndex', () => {
  it('derives the top-level directories from the tracked paths', () => {
    expect([ ...repo.topLevel ].sort()).toEqual([ '.agents', 'src' ]);
  });

  it('leaves out root-level files, which have no directory segment', () => {
    expect(repo.topLevel.has('package.json')).toBe(false);
  });
});

describe('isPlaceholder', () => {
  it.each([
    'src/<entity>/index.ts',
    'src/{slice}/index.ts',
    'src/*/index.ts',
    'src/__name__/index.ts',
  ])('exempts the marked segment in %s', (target) => {
    expect(isPlaceholder(target)).toBe(true);
  });

  it('does not exempt an ordinary path', () => {
    expect(isPlaceholder('src/api/types.ts')).toBe(false);
  });
});

describe('resolves', () => {
  it('finds a path written relative to the referring file', () => {
    write('.agents/rules/docs.md');

    expect(resolves(repo, path.join(root, '.agents'), 'rules/docs.md')).toBe(path.join(root, '.agents/rules/docs.md'));
  });

  it('finds a path written from the repo root', () => {
    write('src/api/types.ts');

    expect(resolves(repo, path.join(root, '.agents'), 'src/api/types.ts')).toBe(path.join(root, 'src/api/types.ts'));
  });

  it('strips a leading ./ before resolving', () => {
    write('.agents/rules/docs.md');

    expect(resolves(repo, path.join(root, '.agents'), './rules/docs.md')).toBeDefined();
  });

  it('prefers the file beside the referrer when both candidates exist', () => {
    write('rules/docs.md');
    write('.agents/rules/docs.md');

    expect(resolves(repo, path.join(root, '.agents'), 'rules/docs.md')).toBe(path.join(root, '.agents/rules/docs.md'));
  });

  it('returns undefined when neither candidate exists', () => {
    expect(resolves(repo, path.join(root, '.agents'), 'rules/gone.md')).toBeUndefined();
  });
});

describe('shorthandFor', () => {
  it('names the full path when exactly one tracked file ends with the target', () => {
    expect(shorthandFor(repo, 'toolkit/theme/theme.ts')).toBe('src/toolkit/theme/theme.ts');
  });

  it('stays silent when several tracked files end with the target — no single location to point at', () => {
    expect(shorthandFor(repo, 'types/api.ts')).toBeUndefined();
  });

  it('stays silent when nothing matches', () => {
    expect(shorthandFor(repo, 'nowhere/at/all.ts')).toBeUndefined();
  });
});

describe('nearby', () => {
  it('is true when the parent directory of the target sits beside the referring file', () => {
    write('.agents/rules/docs.md');

    expect(nearby(path.join(root, '.agents'), 'rules/gone.md')).toBe(true);
  });

  it('is false for a bare filename, which names no directory to look beside', () => {
    expect(nearby(path.join(root, '.agents'), 'gone.md')).toBe(false);
  });

  it('is false for a directory target — a trailing slash names a convention, not one location', () => {
    write('.agents/rules/docs.md');

    expect(nearby(path.join(root, '.agents'), 'rules/')).toBe(false);
  });
});

describe('slugify', () => {
  it.each([
    [ 'What earns a line', 'what-earns-a-line' ],
    [ 'Running `pnpm dev`', 'running-pnpm-dev' ],
    [ 'Gotchas (these bit us)', 'gotchas-these-bit-us' ],
    [ 'Data & API', 'data-api' ],
  ])('matches the GitHub slug for %s', (heading, slug) => {
    expect(slugify(heading)).toBe(slug);
  });
});

describe('headingSlugs', () => {
  it('collects every heading level and ignores non-heading lines', async() => {
    const absPath = write('doc.md', [ '# Top', 'body', '###### Deep One', 'not # a heading', '####### too deep' ].join('\n'));

    expect(await headingSlugs(absPath)).toEqual(new Set([ 'top', 'deep-one' ]));
  });

  it('ignores a hash with no space after it', async() => {
    const absPath = write('doc.md', '#NotAHeading');

    expect(await headingSlugs(absPath)).toEqual(new Set());
  });
});
