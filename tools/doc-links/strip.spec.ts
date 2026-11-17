import { describe, it, expect } from 'vitest';

import { ILLUSTRATION_FORMS, withoutFences, withoutIllustrations } from './strip';

describe('withoutFences', () => {
  it('blanks the fence markers and everything between them', () => {
    const body = [ 'before', '```bash', 'pnpm run gone.sh', '```', 'after' ].join('\n');

    expect(withoutFences(body)).toEqual([ 'before', '', '', '', 'after' ]);
  });

  it('keeps the line numbering, so a finding after a fence points at the right line', () => {
    const body = [ '```', 'x', '```', '', '`src/kept.ts`' ].join('\n');

    expect(withoutFences(body)).toHaveLength(5);
    expect(withoutFences(body)[4]).toBe('`src/kept.ts`');
  });

  it('blanks an indented fence, as found inside a list item', () => {
    const body = [ '  ```', '  `src/gone.ts`', '  ```' ].join('\n');

    expect(withoutFences(body)).toEqual([ '', '', '' ]);
  });

  it('treats an unclosed fence as running to the end of the file', () => {
    const body = [ 'before', '```', 'still fenced' ].join('\n');

    expect(withoutFences(body)).toEqual([ 'before', '', '' ]);
  });
});

describe('withoutIllustrations', () => {
  it('blanks the arrow and its output cell in a table row', () => {
    const row = '| `src/<entity>/index.ts` | → `src/token/index.ts` |';

    expect(withoutIllustrations(row)).toBe('| `src/<entity>/index.ts` | |');
  });

  it('leaves the pattern cell before the arrow checkable', () => {
    const row = '| `src/real.ts` | → `src/made-up.ts` |';

    expect(withoutIllustrations(row)).toContain('`src/real.ts`');
  });

  it('blanks each arrow cell independently in a multi-column row', () => {
    const row = '| a | → `x/one.ts` | b | → `x/two.ts` |';

    expect(withoutIllustrations(row)).toBe('| a | | b | |');
  });

  it('leaves an arrow in prose alone — there it is punctuation, not an illustration mark', () => {
    const line = 'The symlink `.claude/CLAUDE.md` → `.agents/AGENTS.md` is checked once.';

    expect(withoutIllustrations(line)).toBe(line);
  });
});

describe('ILLUSTRATION_FORMS', () => {
  it('names both marks, since it is the only statement of them and is printed on failure', () => {
    expect(ILLUSTRATION_FORMS).toContain('<placeholder>');
    expect(ILLUSTRATION_FORMS).toContain('→');
  });
});
