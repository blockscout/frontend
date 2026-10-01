import { describe, expect, it } from 'vitest';

import type { PrLabels } from './check-tag';
import { bodyPrNumbers, findUpcoming, findVersionedPrs, replaceUpcoming } from './check-tag';

describe('findUpcoming', () => {
  it('reports every line that still says "upcoming", with its file and line number', () => {
    const docs = [
      { path: 'docs/ENVS.md', content: '| Variable | Version |\n| NEXT_PUBLIC_A | v2.12.0+ |\r\n| NEXT_PUBLIC_B | upcoming |\n' },
      { path: 'docs/DEPRECATED_ENVS.md', content: '| NEXT_PUBLIC_C | <Upcoming> |' },
    ];

    expect(findUpcoming(docs)).toEqual([
      { path: 'docs/ENVS.md', line: 3, text: '| NEXT_PUBLIC_B | upcoming |' },
      { path: 'docs/DEPRECATED_ENVS.md', line: 1, text: '| NEXT_PUBLIC_C | <Upcoming> |' },
    ]);
  });

  it('passes docs whose versions are all released', () => {
    expect(findUpcoming([ { path: 'docs/ENVS.md', content: '| NEXT_PUBLIC_A | v2.13.0+ |\n' } ])).toEqual([]);
  });

  it('does not match the word inside another one', () => {
    expect(findUpcoming([ { path: 'docs/ENVS.md', content: 'upcomingVersion\nNOT_UPCOMING' } ])).toEqual([]);
  });
});

describe('replaceUpcoming', () => {
  it('releases every placeholder as the tag and counts them', () => {
    const content = '| NEXT_PUBLIC_A | v2.12.0+ |\n| NEXT_PUBLIC_B | upcoming |\n| NEXT_PUBLIC_C | <Upcoming> |\n| NEXT_PUBLIC_D | `upcoming` |\n';

    expect(replaceUpcoming(content, 'v2.13.0')).toEqual({
      content: '| NEXT_PUBLIC_A | v2.12.0+ |\n| NEXT_PUBLIC_B | v2.13.0+ |\n| NEXT_PUBLIC_C | v2.13.0+ |\n| NEXT_PUBLIC_D | `v2.13.0+` |\n',
      count: 3,
    });
  });

  it('leaves the word inside another one alone', () => {
    expect(replaceUpcoming('upcomingVersion\nNOT_UPCOMING', 'v2.13.0')).toEqual({ content: 'upcomingVersion\nNOT_UPCOMING', count: 0 });
  });

  it('leaves nothing for the tag check to flag', () => {
    const { content } = replaceUpcoming('| A | upcoming |\n| B | <UPCOMING> |\n| C | Upcoming |', 'v2.13.0');

    expect(findUpcoming([ { path: 'docs/ENVS.md', content } ])).toEqual([]);
  });
});

describe('bodyPrNumbers', () => {
  it('reads PR links and #N references, once each, in number order', () => {
    const body = [
      '- Add the release tool by @tom in https://github.com/blockscout/frontend/pull/3750',
      '- Fix a typo by @ann in https://github.com/blockscout/frontend/pull/3701',
      '## 🚨 Changes in ENV variables',
      '- #3750',
      '  - NEXT_PUBLIC_A',
    ].join('\n');

    expect(bodyPrNumbers(body)).toEqual([ 3701, 3750 ]);
  });

  it('ignores PR links into other repositories, anchors, headings and HTML entities', () => {
    const body = [
      '## 💑 Compatibility',
      'See https://github.com/blockscout/blockscout/pull/9001',
      'https://github.com/blockscout/frontend/blob/v2.13.0/docs/ENVS.md#L12',
      'a&#123;b',
      'x#5',
    ].join('\n');

    expect(bodyPrNumbers(body)).toEqual([]);
  });
});

describe('findVersionedPrs', () => {
  const labels = new Map<number, ReadonlyArray<string>>([
    [ 1, [ 'bug' ] ],
    [ 2, [ 'bug', 'v2.12.1' ] ],
    [ 3, [ 'feature', 'v2.13.0' ] ],
    [ 4, [ 'pre-release', 'backport' ] ],
  ]);
  const prLabels: PrLabels = (number) => labels.get(number);

  it('reports PRs already carrying the version label of another release', () => {
    expect(findVersionedPrs('#1 #2 #4', prLabels, 'v2.13.0')).toEqual([ { number: 2, versionLabels: [ 'v2.12.1' ] } ]);
  });

  it('does not count the tag\'s own version label, which the release workflow applies concurrently', () => {
    expect(findVersionedPrs('#3', prLabels, 'v2.13.0')).toEqual([]);
    expect(findVersionedPrs('#3', prLabels, 'v2.13.0-alpha.2')).toEqual([]);
  });

  it('reports the label of an earlier release of the same line', () => {
    expect(findVersionedPrs('#3', prLabels, 'v2.13.1')).toEqual([ { number: 3, versionLabels: [ 'v2.13.0' ] } ]);
  });

  it('skips references that are issues, not PRs', () => {
    expect(findVersionedPrs('#99', prLabels, 'v2.13.0')).toEqual([]);
  });

  it('passes an empty body', () => {
    expect(findVersionedPrs('', prLabels, 'v2.13.0')).toEqual([]);
  });
});
