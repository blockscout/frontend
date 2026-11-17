import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { checkFile } from './check';
import type { RepoIndex } from './resolve';
import { buildRepoIndex } from './resolve';

const DOC = '.agents/AGENTS.md';

const TRACKED = [
  '.agents/AGENTS.md',
  '.agents/rules/docs.md',
  'src/api/types.ts',
  'src/toolkit/theme/theme.ts',
  'src/slices/token/types/api.ts',
  'src/slices/block/types/api.ts',
];

let root: string;
let repo: RepoIndex;

function write(rel: string, body = ''): void {
  const absPath = path.join(root, rel);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, body);
}

async function messagesFor(...lines: ReadonlyArray<string>): Promise<Array<string>> {
  write(DOC, lines.join('\n'));
  return (await checkFile(repo, DOC)).map((finding) => finding.message);
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'doc-links-')));
  repo = buildRepoIndex(root, TRACKED);
  for (const rel of TRACKED) {
    write(rel);
  }
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe('the four reported classes', () => {
  it('reports a backtick path that resolves nowhere', async() => {
    expect(await messagesFor('See `src/api/gone.ts`.')).toEqual([ 'path reference does not exist: src/api/gone.ts' ]);
  });

  it('reports a link target that resolves nowhere', async() => {
    expect(await messagesFor('See [docs](./rules/gone.md).')).toEqual([ 'link target does not exist: ./rules/gone.md' ]);
  });

  it('reports an anchor missing from a target that does resolve', async() => {
    write('.agents/rules/docs.md', '# What earns a line');

    expect(await messagesFor('See [docs](./rules/docs.md#gone).'))
      .toEqual([ 'heading anchor not found in target: ./rules/docs.md#gone' ]);
  });

  it('accepts an anchor that matches a heading, case-insensitively', async() => {
    write('.agents/rules/docs.md', '# What earns a line');

    expect(await messagesFor('See [docs](./rules/docs.md#What-Earns-A-Line).')).toEqual([]);
  });

  it('reports a sibling link written without a slash', async() => {
    expect(await messagesFor('See [docs](gone.md).')).toEqual([ 'link target does not exist: gone.md' ]);
  });

  it('accepts a link to a markdown file with no anchor', async() => {
    expect(await messagesFor('See [docs](./rules/docs.md).')).toEqual([]);
  });

  it('leaves an anchor on a target that is not markdown unchecked', async() => {
    expect(await messagesFor('See [the type](../src/api/types.ts#L20).')).toEqual([]);
  });

  it('reports a shorthand path in full', async() => {
    expect(await messagesFor('See `toolkit/theme/theme.ts`.'))
      .toEqual([ 'toolkit/theme/theme.ts is shorthand; write it in full: src/toolkit/theme/theme.ts' ]);
  });
});

describe('what is not a reference', () => {
  it.each([
    [ 'a fenced block', [ '```', '`src/api/gone.ts`', '[docs](./rules/gone.md)', '```' ] ],
    [ 'a placeholder segment', [ 'See `src/slices/<entity>/index.ts` and [spec](./tasks/<n>/spec.md).' ] ],
    [ 'a table-row arrow', [ '| Pattern | Output |', '| --- | --- |', '| `src/api/types.ts` | → `src/api/gone.ts` |' ] ],
    [ 'a backtick span that is not a path', [ 'Set `someConfigKey`, `a.b.c` and `no-slash-here`.' ] ],
    [ 'bracket text without a slash or an extension', [ 'See [just prose](notafile).' ] ],
    [ 'a protocol or in-page link', [ '[web](https://example.com), [mail](mailto:a@b.c), [top](#heading)' ] ],
    [ 'a backtick span containing whitespace', [ 'Run `node src/api/gone.ts --flag`.' ] ],
    [ 'a slash-bearing span with no file extension', [ 'The request runs through `src/api/resources`.' ] ],
    [ 'a path naming a shape rather than a location', [ 'Every slice has a `types/api.ts`.' ] ],
    [ 'a bare directory naming a convention', [ 'Each slice keeps a `hooks/` folder.' ] ],
  ])('exempts %s', async(_name, lines) => {
    expect(await messagesFor(...lines)).toEqual([]);
  });

  it('still checks a real reference standing beside an illustration', async() => {
    expect(await messagesFor('See `src/slices/<entity>/index.ts` and `src/api/gone.ts`.'))
      .toEqual([ 'path reference does not exist: src/api/gone.ts' ]);
  });

  it('does not read a markdown-link example inside a code span as a link', async() => {
    expect(await messagesFor('Write it as `[Link Text](./rules/gone.md)`.')).toEqual([]);
  });
});

describe('finding order and position', () => {
  it('numbers a finding by its line in the file, fences included', async() => {
    write(DOC, [ '```', 'x', '```', 'See `src/api/gone.ts`.' ].join('\n'));

    expect(await checkFile(repo, DOC)).toEqual([
      { file: DOC, line: 4, message: 'path reference does not exist: src/api/gone.ts' },
    ]);
  });

  it('reports the backtick paths of a line before its links', async() => {
    expect(await messagesFor('`src/api/gone.ts` and [docs](./rules/gone.md)')).toEqual([
      'path reference does not exist: src/api/gone.ts',
      'link target does not exist: ./rules/gone.md',
    ]);
  });

  it('resolves relative references from the realpath of a symlinked entry point', async() => {
    write('.agents/rules/docs.md');
    fs.symlinkSync(path.join(root, DOC), path.join(root, 'CLAUDE.md'));
    write(DOC, 'See `./rules/docs.md`.');

    expect(await checkFile(repo, 'CLAUDE.md')).toEqual([]);
  });
});
