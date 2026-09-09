import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { collectMarkdown, collectSurface, contextDirs, contextSurface, dedupeByRealPath } from './surface';

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

describe('contextDirs', () => {
  it('takes the directory of every file named exactly CONTEXT.md, wherever it lives', () => {
    const tracked = [ 'src/api/CONTEXT.md', 'tools/profiling/CONTEXT.md', 'docs/README.md', 'src/api/index.ts' ];

    expect([ ...contextDirs(tracked) ]).toEqual([ 'src/api', 'tools/profiling' ]);
  });

  it('does not take a directory off a file whose name merely contains CONTEXT.md', () => {
    expect([ ...contextDirs([ 'docs/OLD-CONTEXT.md' ]) ]).toEqual([]);
  });
});

describe('contextSurface', () => {
  it('takes every markdown file beside a CONTEXT.md, not only the CONTEXT.md itself', () => {
    const tracked = [ 'tools/thing/CONTEXT.md', 'tools/thing/NOTES.md', 'tools/thing/index.ts' ];

    expect(contextSurface(tracked)).toEqual([ 'tools/thing/CONTEXT.md', 'tools/thing/NOTES.md' ]);
  });

  it('recurses: a markdown file in a nested subdirectory of a CONTEXT.md directory is in the surface', () => {
    const tracked = [
      'tools/thing/CONTEXT.md',
      'tools/thing/docs/RUNNING.md',
      'tools/thing/adr/0001-why.md',
      'tools/thing/adr/deeper/0002-why.md',
    ];

    expect(contextSurface(tracked)).toEqual(tracked);
  });

  it('takes nothing from a directory with no CONTEXT.md, however much markdown it holds', () => {
    expect(contextSurface([ 'tools/other/CONTEXT.md', 'docs/guide.md' ])).toEqual([ 'tools/other/CONTEXT.md' ]);
  });

  it('leaves a CONTEXT.md directory holding no other markdown with exactly its one file', () => {
    expect(contextSurface([ 'src/api/CONTEXT.md', 'src/api/index.ts' ])).toEqual([ 'src/api/CONTEXT.md' ]);
  });

  it('exempts src/toolkit/package/ — the published wrapper readme addresses npm consumers, not agents', () => {
    const tracked = [ 'src/toolkit/CONTEXT.md', 'src/toolkit/package/README.md' ];

    expect(contextSurface(tracked)).toEqual([ 'src/toolkit/CONTEXT.md' ]);
  });

  it('keeps the exemption a path, so a module README.md elsewhere stays checked', () => {
    const tracked = [ 'tools/thing/CONTEXT.md', 'tools/thing/README.md' ];

    expect(contextSurface(tracked)).toEqual([ 'tools/thing/CONTEXT.md', 'tools/thing/README.md' ]);
  });

  it('still excludes the task specs, which describe files that do not exist yet by design', () => {
    const tracked = [ '.agents/CONTEXT.md', '.agents/tasks/1234-thing/spec.md' ];

    expect(contextSurface(tracked)).toEqual([ '.agents/CONTEXT.md' ]);
  });

  it('skips a generated directory below a CONTEXT.md directory', () => {
    const tracked = [ 'tools/thing/CONTEXT.md', 'tools/thing/node_modules/pkg/README.md' ];

    expect(contextSurface(tracked)).toEqual([ 'tools/thing/CONTEXT.md' ]);
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
  it('walks the config roots in order, then appends the markdown around the tracked CONTEXT.md files', async() => {
    write('.agents/AGENTS.md');
    write('.claude/CLAUDE.md');
    write('src/api/CONTEXT.md');
    write('src/api/docs/RESOURCES.md');

    expect(await collectSurface(root, [ 'src/api/CONTEXT.md', 'src/api/docs/RESOURCES.md' ])).toEqual([
      '.agents/AGENTS.md',
      '.claude/CLAUDE.md',
      'src/api/CONTEXT.md',
      'src/api/docs/RESOURCES.md',
    ]);
  });

  it('reports a CONTEXT.md inside a config root once, under the path the walk found it at', async() => {
    write('.agents/skills/CONTEXT.md');

    expect(await collectSurface(root, [ '.agents/skills/CONTEXT.md' ])).toEqual([ '.agents/skills/CONTEXT.md' ]);
  });

  it('reports a file the config walk already reached once, even when a CONTEXT.md sits beside it', async() => {
    write('.agents/skills/CONTEXT.md');
    write('.agents/skills/SKILL.md');

    expect(await collectSurface(root, [ '.agents/skills/CONTEXT.md', '.agents/skills/SKILL.md' ])).toEqual([
      '.agents/skills/CONTEXT.md',
      '.agents/skills/SKILL.md',
    ]);
  });
});
