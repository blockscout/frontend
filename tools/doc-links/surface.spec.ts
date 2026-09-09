import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { collectMarkdown, collectSurface, contextFiles, dedupeByRealPath } from './surface';

let root: string;

function write(rel: string, body = ''): void {
  const absPath = path.join(root, rel);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, body);
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-links-')));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('collectMarkdown', () => {
  it('walks nested directories and takes .md and .mdc files only', async() => {
    write('.agents/AGENTS.md');
    write('.agents/rules/docs.md');
    write('.agents/rules/docs.mdc');
    write('.agents/skills/run.sh');

    expect((await collectMarkdown(root, '.agents')).sort()).toEqual([
      '.agents/AGENTS.md',
      '.agents/rules/docs.md',
      '.agents/rules/docs.mdc',
    ]);
  });

  it('skips the excluded subtrees', async() => {
    write('.agents/AGENTS.md');
    write('.agents/tasks/1234-thing/spec.md');

    expect(await collectMarkdown(root, '.agents')).toEqual([ '.agents/AGENTS.md' ]);
  });

  it('skips node_modules and other generated directories', async() => {
    write('.agents/node_modules/pkg/README.md');
    write('.agents/.next/build.md');
    write('.agents/AGENTS.md');

    expect(await collectMarkdown(root, '.agents')).toEqual([ '.agents/AGENTS.md' ]);
  });

  it('returns the accumulator unchanged when the root is absent from this checkout', async() => {
    expect(await collectMarkdown(root, '.cursor')).toEqual([]);
  });

  it('does not descend into a symlinked directory — the walk reaches those files by their real path', async() => {
    write('.agents/skills/deploy/SKILL.md');
    write('.claude/CLAUDE.md');
    fs.symlinkSync(path.join(root, '.agents/skills'), path.join(root, '.claude/skills'));

    expect(await collectMarkdown(root, '.claude')).toEqual([ '.claude/CLAUDE.md' ]);
  });
});

describe('contextFiles', () => {
  it('takes the files named exactly CONTEXT.md, wherever they live', () => {
    const tracked = [ 'src/api/CONTEXT.md', 'tools/profiling/CONTEXT.md', 'docs/README.md', 'src/api/index.ts' ];

    expect(contextFiles(tracked)).toEqual([ 'src/api/CONTEXT.md', 'tools/profiling/CONTEXT.md' ]);
  });

  it('does not take a file whose name merely contains CONTEXT.md', () => {
    expect(contextFiles([ 'docs/OLD-CONTEXT.md' ])).toEqual([]);
  });
});

describe('dedupeByRealPath', () => {
  it('keeps the first path that reached a real file, so a symlink does not double-report it', async() => {
    write('.agents/AGENTS.md');
    fs.symlinkSync(path.join(root, '.agents/AGENTS.md'), path.join(root, 'CLAUDE.md'));

    expect(await dedupeByRealPath(root, [ '.agents/AGENTS.md', 'CLAUDE.md' ])).toEqual([ '.agents/AGENTS.md' ]);
  });

  it('preserves the order the paths were walked in', async() => {
    write('.agents/b.md');
    write('.agents/a.md');

    expect(await dedupeByRealPath(root, [ '.agents/b.md', '.agents/a.md' ])).toEqual([ '.agents/b.md', '.agents/a.md' ]);
  });
});

describe('collectSurface', () => {
  it('walks the config roots in order, then appends the tracked CONTEXT.md files', async() => {
    write('.agents/AGENTS.md');
    write('.claude/CLAUDE.md');
    write('src/api/CONTEXT.md');

    expect(await collectSurface(root, [ 'src/api/CONTEXT.md' ])).toEqual([
      '.agents/AGENTS.md',
      '.claude/CLAUDE.md',
      'src/api/CONTEXT.md',
    ]);
  });

  it('reports a CONTEXT.md inside a config root once, under the path the walk found it at', async() => {
    write('.agents/skills/CONTEXT.md');

    expect(await collectSurface(root, [ '.agents/skills/CONTEXT.md' ])).toEqual([ '.agents/skills/CONTEXT.md' ]);
  });
});
