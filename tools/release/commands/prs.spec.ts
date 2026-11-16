import { describe, expect, it } from 'vitest';

import type { ReleasePullRequest } from '../release-prs';
import { parsePrsArgs, prList, prsRange } from './prs';

function pr(number: number, title: string, body: string): ReleasePullRequest {
  return { number, title, author: 'tom2drum', url: `https://github.com/blockscout/frontend/pull/${ number }`, body, labels: [], closingIssues: [] };
}

describe('parsePrsArgs', () => {
  it('reads the alpha, comparing with the previous alpha by default', () => {
    expect(parsePrsArgs([ 'v2.13.0-alpha.2' ])).toEqual({ tag: 'v2.13.0-alpha.2', since: undefined });
  });

  it('reads the tag to compare with', () => {
    expect(parsePrsArgs([ 'v2.13.0-alpha.3', '--since', 'v2.13.0-alpha.1' ])).toEqual({ tag: 'v2.13.0-alpha.3', since: 'v2.13.0-alpha.1' });
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0-alpha.1', 'v2.13.0-alpha.2' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parsePrsArgs(args)).toThrow('Usage: pnpm release prs <vX.Y.Z-alpha.N>');
  });

  it('rejects a tag that is not an alpha', () => {
    expect(() => parsePrsArgs([ 'v2.13.0' ])).toThrow('Not an alpha tag: "v2.13.0"');
  });

  it('rejects a --since that is not a release tag', () => {
    expect(() => parsePrsArgs([ 'v2.13.0-alpha.2', '--since', 'main' ])).toThrow('Not a release tag: "main"');
  });
});

describe('prsRange', () => {
  const TAGS = [ 'v2.12.1', 'v2.13.0-alpha.1', 'v2.13.0-alpha.2' ];

  it('reads from the previous alpha up to the alpha', () => {
    expect(prsRange({ tag: 'v2.13.0-alpha.2', since: undefined }, TAGS)).toEqual({ from: 'v2.13.0-alpha.1', to: 'v2.13.0-alpha.2' });
  });

  it('reads up to the release branch while the alpha is not tagged', () => {
    expect(prsRange({ tag: 'v2.13.0-alpha.3', since: undefined }, TAGS)).toEqual({ from: 'v2.13.0-alpha.2', to: 'release/v2.13.0' });
  });

  it('reads from the tag given to compare with', () => {
    expect(prsRange({ tag: 'v2.13.0-alpha.2', since: 'v2.12.1' }, TAGS)).toEqual({ from: 'v2.12.1', to: 'v2.13.0-alpha.2' });
  });

  it('has no range for the first alpha', () => {
    expect(prsRange({ tag: 'v2.13.0-alpha.1', since: undefined }, TAGS)).toBeUndefined();
  });
});

describe('prList', () => {
  it('lists each PR with its number, title and link, its ENV changes nested under it', () => {
    const envBody = '## Description\n\nSanitize the alert.\n\n## Environment variables\n\n- Limited `NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE` to safe HTML\n';
    const prs = [
      pr(3845, 'Show a scam warning on the address page', '## Environment variables\n\nNone'),
      pr(3859, 'Limit the header maintenance alert to safe HTML', envBody),
    ];

    expect(prList(prs)).toBe([
      '- #3845 Show a scam warning on the address page https://github.com/blockscout/frontend/pull/3845',
      '- #3859 Limit the header maintenance alert to safe HTML https://github.com/blockscout/frontend/pull/3859',
      '  - Limited `NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE` to safe HTML',
    ].join('\n'));
  });
});
