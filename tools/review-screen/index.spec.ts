import { describe, expect, it } from 'vitest';

import { parseArgs } from './index';

describe('parseArgs', () => {
  it('defaults to the branch scope with nothing explicit', () => {
    expect(parseArgs([])).toEqual({ scope: 'branch', base: undefined, spec: undefined, ticket: undefined });
  });

  it('reads every flag in both the separate-token and inline forms', () => {
    expect(parseArgs([ '--scope', 'uncommitted', '--base', 'abc123', '--spec', 's.md', '--ticket', '02' ])).toEqual({
      scope: 'uncommitted',
      base: 'abc123',
      spec: 's.md',
      ticket: '02',
    });
    expect(parseArgs([ '--scope=uncommitted', '--base=abc123' ])).toMatchObject({ scope: 'uncommitted', base: 'abc123' });
  });

  it('rejects a scope other than branch or uncommitted', () => {
    expect(() => parseArgs([ '--scope', 'pr' ])).toThrow('Invalid value for --scope: pr');
  });

  it('rejects an unknown flag, a missing value and a stray positional, with the usage attached', () => {
    expect(() => parseArgs([ '--nope' ])).toThrow(/Unknown flag: --nope\nUsage:/);
    expect(() => parseArgs([ '--base' ])).toThrow('Missing value for --base');
    expect(() => parseArgs([ 'src/a.ts' ])).toThrow(/Unexpected argument: src\/a.ts\nUsage:/);
  });
});
