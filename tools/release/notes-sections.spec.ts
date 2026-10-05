import { describe, expect, it } from 'vitest';

import {
  compatibilityRows,
  envChanges,
  filledSection,
  minimumApiVersions,
  newContributors,
  parseFirstContributions,
  unreadableApiVersions,
} from './notes-sections';
import type { ReleasePullRequest } from './release-prs';

function pr(number: number, body: string): ReleasePullRequest {
  const url = `https://github.com/blockscout/frontend/pull/${ number }`;
  return { number, title: `PR ${ number }`, author: 'tom2drum', url, body, labels: [], closingIssues: [] };
}

function body(sections: Record<string, string>): string {
  return Object.entries(sections).map(([ heading, text ]) => `## ${ heading }\n\n${ text }`).join('\n\n');
}

describe('filledSection', () => {
  it('reads the text under the heading up to the next heading', () => {
    const text = body({ Description: 'Adds a badge', 'Environment variables': 'Added `NEXT_PUBLIC_BADGE`', 'Minimum API version': 'None' });

    expect(filledSection(text, 'Environment variables')).toBe('Added `NEXT_PUBLIC_BADGE`');
  });

  it('matches the heading at any level and case, and reads to the end of the body', () => {
    expect(filledSection('### environment Variables\r\n\r\n- Added `A`\r\n', 'Environment variables')).toBe('- Added `A`');
  });

  it.each([
    [ 'missing', body({ Description: 'Adds a badge' }) ],
    [ 'empty', body({ 'Environment variables': '' }) ],
    [ 'None', body({ 'Environment variables': 'None' }) ],
    [ 'an emphasized none.', body({ 'Environment variables': '_none._' }) ],
    [ 'N/A', body({ 'Environment variables': 'N/A' }) ],
    [ 'None with a reason', body({ 'Environment variables': 'None — the feature reuses `NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED`.' }) ],
    [ 'only a comment', body({ 'Environment variables': '<!-- fill me -->' }) ],
    [ 'the template placeholder', body({ 'Environment variables': '*[List each environment variable added, changed, or removed, or "None".]*' }) ],
  ])('is nothing when the section is %s', (_, text) => {
    expect(filledSection(text, 'Environment variables')).toBeUndefined();
  });
});

describe('envChanges', () => {
  it('groups each PR\'s changes under its number, as a nested list', () => {
    const prs = [
      pr(3005, body({ 'Environment variables': '- Added `NEXT_PUBLIC_AD`\n- Removed the `hype` option' })),
      pr(2968, body({ 'Environment variables': 'Added `NEXT_PUBLIC_SOCKET_URL`' })),
    ];

    expect(envChanges(prs)).toBe([
      '- #3005',
      '  - Added `NEXT_PUBLIC_AD`',
      '  - Removed the `hype` option',
      '- #2968',
      '  - Added `NEXT_PUBLIC_SOCKET_URL`',
    ].join('\n'));
  });

  it('keeps paragraphs and code blocks of a change, nested under the PR', () => {
    const section = 'Added `NEXT_PUBLIC_EXPEDITED_REVIEW_HTML`.\n\n**Example value**:\n\n```\nNEXT_PUBLIC_EXPEDITED_REVIEW_HTML=<b>Pay</b>\n```';

    expect(envChanges([ pr(3644, body({ 'Environment variables': section })) ])).toBe([
      '- #3644',
      '  - Added `NEXT_PUBLIC_EXPEDITED_REVIEW_HTML`.',
      '',
      '  **Example value**:',
      '',
      '  ```',
      '  NEXT_PUBLIC_EXPEDITED_REVIEW_HTML=<b>Pay</b>',
      '  ```',
    ].join('\n'));
  });

  it('leaves out PRs whose section says None or is missing', () => {
    const prs = [ pr(1, body({ 'Environment variables': 'None' })), pr(2, 'Old PR body'), pr(3, body({ 'Environment variables': 'Added `A`' })) ];

    expect(envChanges(prs)).toBe('- #3\n  - Added `A`');
  });

  it('is empty when every PR says None', () => {
    expect(envChanges([ pr(1, body({ 'Environment variables': 'None' })), pr(2, body({ 'Environment variables': 'None.' })) ])).toBe('');
  });
});

describe('minimumApiVersions', () => {
  it('maps Core API to the Blockscout API row', () => {
    expect(minimumApiVersions(body({ 'Minimum API version': 'Core API v11.2.4+' }))).toEqual([ { service: 'Blockscout API', version: '11.2.4' } ]);
  });

  it('reads several services from a list or one line', () => {
    const listed = body({ 'Minimum API version': '- Core API v11.2.4+\n- Stats microservice v2.5.0+' });
    const inline = body({ 'Minimum API version': 'Core API v11.2.4+ and stats v2.5' });
    const expected = [ { service: 'Blockscout API', version: '11.2.4' }, { service: 'Stats microservice API', version: '2.5.0' } ];

    expect(minimumApiVersions(listed)).toEqual(expected);
    expect(minimumApiVersions(inline)).toEqual([ expected[0], { ...expected[1], version: '2.5' } ]);
  });

  it('reads an emphasized version and ignores the explanation around it', () => {
    const section = '- `tac-operation-lifecycle` **v1.2.0+** — the service release that serves Read API v2.\n- Core **v11.2.8+** (search, v2 shape)';

    expect(minimumApiVersions(body({ 'Minimum API version': section }))).toEqual([
      { service: 'Tac-operation-lifecycle microservice API', version: '1.2.0' },
      { service: 'Blockscout API', version: '11.2.8' },
    ]);
  });

  it('does not read a version quoted in prose as a requirement', () => {
    const section = 'The endpoint is merged but **not released yet** (latest release is v11.2.6), so the requirement is the next Core API release.';

    expect(minimumApiVersions(body({ 'Minimum API version': section }))).toEqual([]);
  });

  it('is empty for None and for a PR without the section', () => {
    expect(minimumApiVersions(body({ 'Minimum API version': 'None' }))).toEqual([]);
    expect(minimumApiVersions('Old PR body')).toEqual([]);
  });
});

describe('unreadableApiVersions', () => {
  it('lists PRs that fill the section without naming a versioned service', () => {
    const prs = [
      pr(1, body({ 'Minimum API version': 'The latest backend' })),
      pr(2, body({ 'Minimum API version': 'None' })),
      pr(3, body({ 'Minimum API version': 'Core API v11.2.4+' })),
    ];

    expect(unreadableApiVersions(prs)).toEqual([ 1 ]);
  });
});

describe('compatibilityRows', () => {
  it('lists each raised service once, at the highest version, Blockscout API first', () => {
    const prs = [
      pr(1, body({ 'Minimum API version': 'Stats microservice v2.5.0+' })),
      pr(2, body({ 'Minimum API version': 'Core API v11.2.4+' })),
      pr(3, body({ 'Minimum API version': 'Core API v11.10.0+' })),
      pr(4, body({ 'Minimum API version': 'Core API v11.9.9+\n- Bens microservice v1.2.0' })),
    ];

    expect(compatibilityRows(prs)).toBe([
      '| Blockscout API | v11.10.0 |',
      '| Bens microservice API | v1.2.0 |',
      '| Stats microservice API | v2.5.0 |',
    ].join('\n'));
  });

  it('treats a missing patch number as zero', () => {
    const prs = [ pr(1, body({ 'Minimum API version': 'Core API v11.2.0' })), pr(2, body({ 'Minimum API version': 'Core API v11.2' })) ];

    expect(compatibilityRows(prs)).toBe('| Blockscout API | v11.2.0 |');
  });

  it('is empty when no PR raises a version', () => {
    expect(compatibilityRows([ pr(1, body({ 'Minimum API version': 'None' })) ])).toBe('');
  });
});

describe('new contributors', () => {
  const generated = [
    '## What\'s Changed',
    '* Add the badge by @alice in https://github.com/blockscout/frontend/pull/10',
    '',
    '## New Contributors',
    '* @alice made their first contribution in https://github.com/blockscout/frontend/pull/10',
    '* @bob made their first contribution in https://github.com/blockscout/frontend/pull/11',
    '',
    '**Full Changelog**: https://github.com/blockscout/frontend/compare/v2.12.1...v2.13.0',
  ].join('\n');

  it('reads the first contributions from GitHub\'s generated notes', () => {
    expect(parseFirstContributions(generated)).toEqual([ { author: 'alice', number: 10 }, { author: 'bob', number: 11 } ]);
  });

  it('keeps only first contributions made by a PR of these notes', () => {
    expect(newContributors([ pr(10, '') ], parseFirstContributions(generated)))
      .toBe('- @alice made their first contribution in https://github.com/blockscout/frontend/pull/10');
  });
});
