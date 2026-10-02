import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { CATEGORIES } from './categories';
import type { NotesSource } from './notes';
import { categoryOf, fillTemplate, releaseNotes, renderNotes } from './notes';
import type { Commit, ReleasePullRequest } from './release-prs';

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'notes-template.md'), 'utf8');

function pr(number: number, labels: ReadonlyArray<string>, overrides: Partial<ReleasePullRequest> = {}): ReleasePullRequest {
  return {
    number,
    title: `PR ${ number }`,
    author: 'tom2drum',
    url: `https://github.com/blockscout/frontend/pull/${ number }`,
    body: '',
    labels,
    closingIssues: [],
    ...overrides,
  };
}

const META = { tag: 'v2.13.0', previousTag: 'v2.12.1', template: TEMPLATE, firstContributions: [] };
const FULL_CHANGELOG = '---\n\n**Full Changelog**: https://github.com/blockscout/frontend/compare/v2.12.1...v2.13.0\n';

describe('the notes template', () => {
  it('has one PR list per category, in section order', () => {
    const lists = [ ...TEMPLATE.replace(/<!--[\s\S]*?-->/, '').matchAll(/\{\{prs:([^}]+)\}\}/g) ].map(([ , section ]) => section);

    expect(lists).toEqual(CATEGORIES.map(({ section }) => section));
  });
});

describe('categoryOf', () => {
  it('places a PR by its category label', () => {
    expect(categoryOf([ 'ENVs', 'bug' ]).section).toBe('Bug Fixes');
  });

  it('places a PR with two category labels in the earlier section, whatever the label order', () => {
    expect(categoryOf([ 'refactoring', 'feature' ]).section).toBe('New Features');
    expect(categoryOf([ 'feature', 'refactoring' ]).section).toBe('New Features');
  });

  it('places a PR without a category label in Other Changes', () => {
    expect(categoryOf([ 'ENVs' ]).section).toBe('Other Changes');
  });
});

describe('fillTemplate', () => {
  it('drops a block, up to the next heading or rule, when one of its placeholders is empty', () => {
    const template = '## A\n{{a}}\n\n## B\n{{b}} and {{c}}\n\n---\n\n{{c}}\n';

    expect(fillTemplate(template, new Map([ [ 'a', 'one' ], [ 'b', '' ], [ 'c', 'three' ] ]))).toBe('## A\none\n\n---\n\nthree\n');
  });

  it('strips template comments', () => {
    expect(fillTemplate('<!--\nHow to edit\n-->\n## A\n{{a}}\n', new Map([ [ 'a', 'one' ] ]))).toBe('## A\none\n');
  });

  it('rejects an unknown placeholder', () => {
    expect(() => fillTemplate('## A\n{{typo}}\n', new Map())).toThrow('Unknown placeholder {{typo}}');
  });
});

describe('renderNotes', () => {
  it('lists each PR once under its section, title capitalised, empty sections dropped', () => {
    const prs = [
      pr(10, [ 'feature', 'refactoring' ], { title: 'add the badge', author: 'alice' }),
      pr(11, [ 'bug' ]),
      pr(12, []),
      pr(13, [ 'enhancement' ]),
    ];

    expect(renderNotes(prs, META)).toBe([
      '## 🚀 New Features',
      '- Add the badge by @alice in https://github.com/blockscout/frontend/pull/10',
      '- PR 13 by @tom2drum in https://github.com/blockscout/frontend/pull/13',
      '',
      '## 🐛 Bug Fixes',
      '- PR 11 by @tom2drum in https://github.com/blockscout/frontend/pull/11',
      '',
      '## ✨ Other Changes',
      '- PR 12 by @tom2drum in https://github.com/blockscout/frontend/pull/12',
      '',
      FULL_CHANGELOG,
    ].join('\n'));
  });

  it('fills the ENV, Compatibility and New Contributors sections', () => {
    const prs = [
      pr(10, [ 'feature' ], {
        author: 'alice',
        body: '## Environment variables\n\nAdded `NEXT_PUBLIC_BADGE`\n\n## Minimum API version\n\nCore API v11.2.4+',
      }),
    ];

    expect(renderNotes(prs, { ...META, firstContributions: [ { author: 'alice', number: 10 } ] })).toBe([
      '## 🚀 New Features',
      '- PR 10 by @alice in https://github.com/blockscout/frontend/pull/10',
      '',
      '## 🚨 Changes in ENV variables',
      '- #10',
      '  - Added `NEXT_PUBLIC_BADGE`',
      '',
      '**Full list of the ENV variables**: [v2.13.0](https://github.com/blockscout/frontend/blob/v2.13.0/docs/ENVS.md)',
      '',
      '## 💑 Compatibility',
      'This release raises the minimum required version of the following API services:',
      '',
      '| Service | Version |',
      '| --- | --- |',
      '| Blockscout API | v11.2.4 |',
      '',
      '## 🦄 New Contributors',
      '- @alice made their first contribution in https://github.com/blockscout/frontend/pull/10',
      '',
      FULL_CHANGELOG,
    ].join('\n'));
  });
});

describe('releaseNotes', () => {
  const TAGS = [ 'v2.12.0', 'v2.12.1', 'v2.13.0-alpha.1', 'v2.13.0' ];

  function source(rangeStart: string, commits: ReadonlyArray<Commit>, pullRequests: ReadonlyArray<ReleasePullRequest>): NotesSource {
    return {
      tags: () => TAGS,
      commits: (from) => (from === rangeStart ? commits : []),
      commitMessage: () => '',
      associatedPr: () => undefined,
      pullRequest: (number) => pullRequests.find((pullRequest) => pullRequest.number === number) ?? pr(number, []),
      generatedNotes: (tag, previousTag) => `* @alice made their first contribution in https://github.com/x/y/pull/10 (${ tag }, ${ previousTag })`,
    };
  }

  it('lists a minor\'s PRs since the previous minor\'s last release, without those a version already shipped', () => {
    const commits = [ { sha: 'c1', message: 'Add the badge (#10)' }, { sha: 'c2', message: 'Fix the gas tracker (#11)' } ];
    const notes = releaseNotes('v2.13.0', source('v2.12.1', commits, [ pr(10, [ 'feature' ]), pr(11, [ 'bug', 'v2.12.1' ]) ]), TEMPLATE);

    expect(notes.previousTag).toBe('v2.12.1');
    expect(notes.skipped.map(({ number }) => number)).toEqual([ 11 ]);
    expect(notes.markdown).toContain('/pull/10');
    expect(notes.markdown).not.toContain('/pull/11');
    expect(notes.markdown).toContain('@alice made their first contribution');
  });

  it('lists a patch\'s PRs picked since the previous patch of its line', () => {
    const commits = [ { sha: 'c3', message: `Fix the badge (#12)\n\n(cherry picked from commit ${ 'a'.repeat(40) })` } ];
    const notesSource = { ...source('v2.13.0', commits, [ pr(12, [ 'bug' ]) ]), commitMessage: () => 'Fix the badge (#12)' };
    const notes = releaseNotes('v2.13.1-alpha.1', notesSource, TEMPLATE);

    expect(notes.previousTag).toBe('v2.13.0');
    expect(notes.markdown).toContain('## 🐛 Bug Fixes\n- PR 12 by @tom2drum in https://github.com/blockscout/frontend/pull/12');
    expect(notes.markdown).toContain('compare/v2.13.0...v2.13.1-alpha.1');
  });
});
