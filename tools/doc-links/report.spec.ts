import { describe, it, expect } from 'vitest';

import type { Finding } from './check';
import { renderReport } from './report';
import { ILLUSTRATION_FORMS } from './strip';

const FILE_COUNT = 67;

const FINDINGS: ReadonlyArray<Finding> = [
  { file: '.agents/AGENTS.md', line: 12, message: 'path reference does not exist: src/api/gone.ts' },
  { file: 'src/api/CONTEXT.md', line: 3, message: 'link target does not exist: ./gone.md' },
];

describe('renderReport', () => {
  it('prints one summary line on stdout and exits 0 when nothing is broken', () => {
    expect(renderReport([], FILE_COUNT)).toEqual({
      output: [ { stream: 'out', text: `Doc links: ${ FILE_COUNT } files checked, every reference resolves.` } ],
      exitCode: 0,
    });
  });

  it('prints file:line — message per finding on stderr, in the order found', () => {
    const { output } = renderReport(FINDINGS, FILE_COUNT);

    expect(output.slice(0, 2)).toEqual([
      { stream: 'err', text: '.agents/AGENTS.md:12 — path reference does not exist: src/api/gone.ts' },
      { stream: 'err', text: 'src/api/CONTEXT.md:3 — link target does not exist: ./gone.md' },
    ]);
  });

  it('closes with a count footer that restates the illustration convention, and exits 1', () => {
    const { output, exitCode } = renderReport(FINDINGS, FILE_COUNT);

    expect(exitCode).toBe(1);
    expect(output[output.length - 1]).toEqual({
      stream: 'err',
      text: `\n2 unresolved reference(s) across ${ FILE_COUNT } file(s).\n` +
        `A path naming a shape rather than a file has to be marked as one, or it is read as a reference: ${ ILLUSTRATION_FORMS }.`,
    });
  });
});
