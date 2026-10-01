import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { checkPr, parseTemplate } from './check-pr';

const TEMPLATE = [
  '## Description',
  '',
  '*[What this pull request changes and why.]*',
  '',
  '## Environment variables',
  '',
  '*[List each environment variable, or "None".]*',
  '',
].join('\n');

const FILLED_BODY = [
  '## Description',
  '',
  'Adds the release tool.',
  '',
  '## Environment variables',
  '',
  'None',
].join('\n');

describe('parseTemplate', () => {
  it('reads each heading with the italic placeholder lines under it', () => {
    expect(parseTemplate(TEMPLATE)).toEqual([
      { heading: '## Description', placeholders: [ '*[What this pull request changes and why.]*' ] },
      { heading: '## Environment variables', placeholders: [ '*[List each environment variable, or "None".]*' ] },
    ]);
  });

  it('ignores prose that is not an italic bracketed placeholder', () => {
    expect(parseTemplate('## A\nplain text\n*italic*\n[link](x)\n')).toEqual([ { heading: '## A', placeholders: [] } ]);
  });

  it('reads the repository template: every section has a heading and a placeholder', () => {
    const template = fs.readFileSync(path.resolve(__dirname, '../../docs/PULL_REQUEST_TEMPLATE.md'), 'utf8');
    const sections = parseTemplate(template);

    expect(sections.map(({ heading }) => heading)).toEqual([
      '## Description',
      '## Environment variables',
      '## Minimum API version',
      '## Breaking or incompatible changes',
      '## Additional information',
    ]);
    expect(sections.every(({ placeholders }) => placeholders.length === 1)).toBe(true);
  });
});

describe('checkPr', () => {
  it('passes a filled-in body with one category label', () => {
    expect(checkPr(FILLED_BODY, [ 'feature' ], TEMPLATE)).toEqual([]);
  });

  it('ignores labels that are not categories', () => {
    expect(checkPr(FILLED_BODY, [ 'QA', 'bug', 'skip checks' ], TEMPLATE)).toEqual([]);
  });

  it('accepts a body with CRLF line endings and indented headings', () => {
    const body = FILLED_BODY.replace('## Description', '  ## Description  ').replace(/\n/g, '\r\n');
    expect(checkPr(body, [ 'chore' ], TEMPLATE)).toEqual([]);
  });

  it('reports each missing template heading', () => {
    expect(checkPr('Adds the release tool.', [ 'chore' ], TEMPLATE)).toEqual([
      'Missing template heading "## Description"',
      'Missing template heading "## Environment variables"',
    ]);
  });

  it('does not accept a heading at another level or with different text', () => {
    const body = FILLED_BODY.replace('## Description', '### Description').replace('## Environment variables', '## Env vars');
    expect(checkPr(body, [ 'chore' ], TEMPLATE)).toEqual([
      'Missing template heading "## Description"',
      'Missing template heading "## Environment variables"',
    ]);
  });

  it('reports a placeholder left in place, naming its section', () => {
    expect(checkPr(TEMPLATE, [ 'chore' ], TEMPLATE)).toEqual([
      'Placeholder text left under "## Description"',
      'Placeholder text left under "## Environment variables"',
    ]);
  });

  it('reports a placeholder with text appended to it on the same line', () => {
    const body = FILLED_BODY.replace('None', '*[List each environment variable, or "None".]* None');
    expect(checkPr(body, [ 'chore' ], TEMPLATE)).toEqual([ 'Placeholder text left under "## Environment variables"' ]);
  });

  it('reports a missing category label, listing the allowed ones', () => {
    expect(checkPr(FILLED_BODY, [ 'QA' ], TEMPLATE)).toEqual([
      'No category label; add one of: feature, enhancement, client feature, bug, performance, dependencies, design, refactoring, chore',
    ]);
  });

  it('reports more than one category label', () => {
    expect(checkPr(FILLED_BODY, [ 'bug', 'chore' ], TEMPLATE)).toEqual([ 'More than one category label: bug, chore; keep one' ]);
  });

  it('counts two labels of the same section as two categories', () => {
    expect(checkPr(FILLED_BODY, [ 'feature', 'enhancement' ], TEMPLATE)).toEqual([ 'More than one category label: feature, enhancement; keep one' ]);
  });

  it('reports dependencies combined with another category instead of the generic count failure', () => {
    expect(checkPr(FILLED_BODY, [ 'dependencies', 'bug', 'design' ], TEMPLATE)).toEqual([
      '"dependencies" is only for PRs that just bump a package and cannot be combined with: bug, design',
    ]);
  });

  it('passes dependencies on its own', () => {
    expect(checkPr(FILLED_BODY, [ 'dependencies' ], TEMPLATE)).toEqual([]);
  });

  it('reports template and category failures together', () => {
    expect(checkPr('', [], TEMPLATE)).toHaveLength(3);
  });

  it('exempts a PR labeled release from every rule', () => {
    expect(checkPr('', [ 'release' ], TEMPLATE)).toEqual([]);
    expect(checkPr(TEMPLATE, [ 'release', 'bug', 'chore' ], TEMPLATE)).toEqual([]);
  });
});
