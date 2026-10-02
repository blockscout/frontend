import { describe, expect, it } from 'vitest';

import { parseLabelArgs, shippedBackports } from './label';

describe('parseLabelArgs', () => {
  it('reads an apply with its label defaults', () => {
    expect(parseLabelArgs([ 'v2.13.0', '--label', 'v2.13.0' ])).toEqual({
      tag: 'v2.13.0',
      action: { kind: 'apply', label: 'v2.13.0', description: '', color: 'FFFFFF' },
      dryRun: false,
    });
  });

  it('reads the label description, color and dry run', () => {
    const args = [ 'v2.13.0-alpha.1', '--label=pre-release', '--description=Tasks in pre-release right now', '--color', '0E8A16', '--dry-run' ];

    expect(parseLabelArgs(args)).toEqual({
      tag: 'v2.13.0-alpha.1',
      action: { kind: 'apply', label: 'pre-release', description: 'Tasks in pre-release right now', color: '0E8A16' },
      dryRun: true,
    });
  });

  it('accepts an empty description', () => {
    expect(parseLabelArgs([ 'v2.13.0', '--label=v2.13.0', '--description=' ]).action).toMatchObject({ description: '' });
  });

  it('reads a removal', () => {
    expect(parseLabelArgs([ 'v2.13.0', '--remove', 'pre-release' ])).toEqual({
      tag: 'v2.13.0',
      action: { kind: 'remove', label: 'pre-release' },
      dryRun: false,
    });
  });

  it.each([
    [ 'neither --label nor --remove', [ 'v2.13.0' ] ],
    [ 'both --label and --remove', [ 'v2.13.0', '--label', 'a', '--remove', 'b' ] ],
  ])('rejects %s', (_, args) => {
    expect(() => parseLabelArgs(args)).toThrow('Pass exactly one of --label and --remove');
  });

  it.each([
    [ 'no tag', [ '--label', 'v2.13.0' ] ],
    [ 'two tags', [ 'v2.13.0', 'v2.13.1', '--label', 'v2.13.0' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parseLabelArgs(args)).toThrow('Usage: pnpm release label <tag>');
  });

  it('rejects a tag that is not a release tag', () => {
    expect(() => parseLabelArgs([ 'main', '--label', 'v2.13.0' ])).toThrow('Not a release tag: "main"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parseLabelArgs([ 'v2.13.0', '--label', 'v2.13.0', '--force' ])).toThrow('Unknown flag: --force');
  });
});

describe('shippedBackports', () => {
  const pr = (number: number, labels: ReadonlyArray<string>) => ({ number, title: '', author: '', url: '', body: '', labels, closingIssues: [] });
  const prs = [ pr(1, [ 'bug', 'backport' ]), pr(2, [ 'feature' ]), pr(3, [ 'backport' ]) ];

  it('names the shipped PRs that carry "backport" when the label is a version', () => {
    expect(shippedBackports(prs, 'v2.13.1')).toEqual([ 1, 3 ]);
  });

  it('drops nothing for a label that is not a version', () => {
    expect(shippedBackports(prs, 'pre-release')).toEqual([]);
  });
});
