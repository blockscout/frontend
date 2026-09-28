import { describe, expect, it } from 'vitest';

import { formatSuspectRef, parseLocation, parseOriginsInput, parseSuspectRef } from './parse';

const MARKDOWN = `## Findings

| id | axis | location | sources |
| --- | --- | --- | --- |
| F1 | correctness | \`src/a.ts:41\` | correctness, jev |
| F2 | standards | \`src/b.ts:7\` | standards |
| F3 | spec | FR3 | jev |
| F4 | spec | — | spec |

Some prose between the tables.

| suspect | fate | reason |
| --- | --- | --- |
| \`no-comments src/c.ts:12\` | dropped | the comment explains a workaround |
| FR5 | dropped | addressed in the PR description |
| \`no-comments src/a.ts:41\` | confirmed | F1 |
`;

const JSON_INPUT = JSON.stringify([
  { id: 'F1', axis: 'correctness', location: 'src/a.ts:41', sources: [ 'correctness', 'jev' ] },
  { id: 'F2', axis: 'standards', location: 'src/b.ts:7', sources: 'standards' },
  { id: 'F3', axis: 'spec', location: 'FR3', sources: [ 'jev' ] },
  { id: 'F4', axis: 'spec', location: '—', sources: [ 'spec' ] },
  { suspect: 'no-comments src/c.ts:12', fate: 'dropped', reason: 'the comment explains a workaround' },
  { suspect: 'FR5', fate: 'dropped', reason: 'addressed in the PR description' },
  { suspect: 'no-comments src/a.ts:41', fate: 'confirmed', finding: 'F1' },
]);

const EXPECTED = {
  findings: [
    { id: 'F1', axis: 'correctness', location: { kind: 'line', file: 'src/a.ts', line: 41 }, sources: [ 'correctness', 'jev' ] },
    { id: 'F2', axis: 'standards', location: { kind: 'line', file: 'src/b.ts', line: 7 }, sources: [ 'standards' ] },
    { id: 'F3', axis: 'spec', location: { kind: 'requirement', requirement: 'FR3' }, sources: [ 'jev' ] },
    { id: 'F4', axis: 'spec', location: { kind: 'none' }, sources: [ 'spec' ] },
  ],
  drops: [
    { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/c.ts', line: 12 }, reason: 'the comment explains a workaround' },
    { suspect: { kind: 'spec', requirement: 'FR5' }, reason: 'addressed in the PR description' },
  ],
};

describe('parseOriginsInput', () => {
  it('reads the findings table and the drop list from Markdown, ignoring prose and confirmed rows', () => {
    expect(parseOriginsInput(MARKDOWN)).toEqual(EXPECTED);
  });

  it('reads the same two lists from a JSON array', () => {
    expect(parseOriginsInput(JSON_INPUT)).toEqual(EXPECTED);
  });

  it('accepts a findings table with no rows and no drop table', () => {
    expect(parseOriginsInput('| id | axis | location | sources |\n| --- | --- | --- | --- |\n')).toEqual({ findings: [], drops: [] });
    expect(parseOriginsInput('[]')).toEqual({ findings: [], drops: [] });
  });

  it('reads a numeric id as text, missing sources as none, and drops empty or dash sources from a list or a cell', () => {
    const json = JSON.stringify([
      { id: 7, axis: 'spec', location: 'FR1', sources: [ 'jev', '', ' ' ] },
      { id: 'F2', axis: 'spec', location: 'FR2' },
      { suspect: 'FR5', fate: 'dropped' },
    ]);
    expect(parseOriginsInput(json)).toEqual({
      findings: [
        { id: '7', axis: 'spec', location: { kind: 'requirement', requirement: 'FR1' }, sources: [ 'jev' ] },
        { id: 'F2', axis: 'spec', location: { kind: 'requirement', requirement: 'FR2' }, sources: [] },
      ],
      drops: [ { suspect: { kind: 'spec', requirement: 'FR5' }, reason: '' } ],
    });

    const markdown = '| id | axis | location | sources |\n| --- | --- | --- | --- |\n| F1 | spec | FR1 | — |\n| F2 | spec | FR2 | `, jev` |\n';
    expect(parseOriginsInput(markdown).findings.map((row) => row.sources)).toEqual([ [], [ 'jev' ] ]);
  });

  it('rejects Markdown without a findings table, a JSON value that is not an array, and a row missing a column', () => {
    expect(() => parseOriginsInput('| suspect | fate | reason |\n| --- | --- | --- |\n')).toThrow('No findings table');
    expect(() => parseOriginsInput('{ "id": "F1" }')).toThrow('No findings table');
    expect(() => parseOriginsInput('[ { "id": "F1", "axis": "spec" } ]')).toThrow('Missing "location"');
    expect(() => parseOriginsInput('[ 1 ]')).toThrow('Expected an object');
    expect(() => parseOriginsInput('[ null ]')).toThrow('Expected an object');
    expect(() => parseOriginsInput('[ [] ]')).toThrow('Expected an object');
  });

  it('does not take a pipe block for a table without a separator row under the header', () => {
    expect(() => parseOriginsInput('| id | axis | location | sources |\n| F1 | spec | FR1 | jev |\n')).toThrow('No findings table');
  });
});

describe('parseLocation', () => {
  it('reads a file and line, a requirement id, and the no-location dash, with or without backticks', () => {
    expect(parseLocation('`src/slices/token/pages/Holders.tsx:41`')).toEqual({ kind: 'line', file: 'src/slices/token/pages/Holders.tsx', line: 41 });
    expect(parseLocation('FR12')).toEqual({ kind: 'requirement', requirement: 'FR12' });
    expect(parseLocation('—')).toEqual({ kind: 'none' });
    expect(parseLocation('')).toEqual({ kind: 'none' });
  });

  it('rejects a path with no line', () => {
    expect(() => parseLocation('src/a.ts')).toThrow('Cannot read finding location: src/a.ts');
  });
});

describe('parseSuspectRef', () => {
  it('round-trips through formatSuspectRef', () => {
    const standards = parseSuspectRef('rule-without-mechanism .agents/rules/x.md:3');
    expect(standards).toEqual({ kind: 'standards', rule: 'rule-without-mechanism', file: '.agents/rules/x.md', line: 3 });
    expect(formatSuspectRef(standards)).toBe('rule-without-mechanism .agents/rules/x.md:3');
    expect(formatSuspectRef(parseSuspectRef('FR2'))).toBe('FR2');
  });

  it('rejects a reference without a rule or without a line', () => {
    expect(() => parseSuspectRef('src/a.ts:3')).toThrow('Cannot read suspect reference');
    expect(() => parseSuspectRef('no-comments src/a.ts')).toThrow('Cannot read suspect reference');
  });
});
