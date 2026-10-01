import { describe, expect, it } from 'vitest';

import { branchStep, parsePrepareArgs, releaseEnvDocs } from './prepare';

describe('parsePrepareArgs', () => {
  it('reads the line', () => {
    expect(parsePrepareArgs([ 'v2.13' ])).toEqual({ line: { major: 2, minor: 13 }, dryRun: false });
  });

  it('reads the dry run', () => {
    expect(parsePrepareArgs([ 'v2.13', '--dry-run' ])).toEqual({ line: { major: 2, minor: 13 }, dryRun: true });
  });

  it.each([
    [ 'no line', [] ],
    [ 'two lines', [ 'v2.13', 'v2.14' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parsePrepareArgs(args)).toThrow('Usage: pnpm release prepare <vX.Y>');
  });

  it('rejects a tag in place of a line', () => {
    expect(() => parsePrepareArgs([ 'v2.13.0' ])).toThrow('Not a release line: "v2.13.0"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parsePrepareArgs([ 'v2.13', '--force' ])).toThrow('Unknown flag: --force');
  });
});

describe('releaseEnvDocs', () => {
  it('releases "upcoming" in each ENV doc that has it, leaving out the others', () => {
    const docs: Record<string, string> = {
      'docs/ENVS.md': '| A | upcoming |\n| B | v2.12.0+ |\n| C | <upcoming> |\n',
      'docs/DEPRECATED_ENVS.md': '| D | v2.11.0+ |\n',
    };

    expect(releaseEnvDocs((docPath) => docs[docPath], 'v2.13.0')).toEqual([
      { path: 'docs/ENVS.md', content: '| A | v2.13.0+ |\n| B | v2.12.0+ |\n| C | v2.13.0+ |\n', count: 2 },
    ]);
  });
});

describe('branchStep', () => {
  const BASE = '0123456789abcdef0123456789abcdef01234567';

  it('names the docs commit and the counts it replaces', () => {
    const docs = [ { path: 'docs/ENVS.md', content: '', count: 2 }, { path: 'docs/DEPRECATED_ENVS.md', content: '', count: 1 } ];

    expect(branchStep('release/v2.13', BASE, docs, 'v2.13.0').title).toBe(
      'Cut release/v2.13 at origin/main (0123456789) plus the commit "chore: prepare release v2.13.0", ' +
      '"upcoming" → v2.13.0+ in docs/ENVS.md (2), docs/DEPRECATED_ENVS.md (1)',
    );
  });

  it('cuts the branch with no commit when no doc says "upcoming"', () => {
    expect(branchStep('release/v2.13', BASE, [], 'v2.13.0').title).toBe(
      'Cut release/v2.13 at origin/main (0123456789); the ENV docs say "upcoming" nowhere, so no docs commit',
    );
  });
});
