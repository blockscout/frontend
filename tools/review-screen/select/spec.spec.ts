import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { parseRequirements, readSpec } from './spec';

const FIXTURE = `# Some task

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/1 |

## Context & goal

1. Not a requirement: this list sits outside the section.

## Functional requirements

1. A CLI tool under \`tools/\` screens a change and emits suspects as JSON. It resolves the base ref
   and the touched files from \`--scope branch|uncommitted\`, or takes them explicitly.
2. **Standards grid.** For each rubric rule and each touched file matching the rule's glob, the tool
   scores the probability of a breach.
3. Thresholds live in the tool's config.

4. A requirement after a blank line.

## Data & API

- TypeSafe Jev: POST https://api.typesafe.ai/v1/systemone.

1. Not a requirement either.
`;

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

describe('parseRequirements', () => {
  it('reads the numbered list under the Functional requirements heading only', () => {
    expect(parseRequirements(FIXTURE).map((requirement) => requirement.id)).toEqual([ 'FR1', 'FR2', 'FR3', 'FR4' ]);
  });

  it('joins a multi-line requirement into one line of text', () => {
    const [ first ] = parseRequirements(FIXTURE);
    expect(first.text).toBe(
      'A CLI tool under `tools/` screens a change and emits suspects as JSON. It resolves the base ref ' +
      'and the touched files from `--scope branch|uncommitted`, or takes them explicitly.',
    );
  });

  it('keeps a bold lead-in as part of the text, without the markup, and never as the id', () => {
    const [ , second ] = parseRequirements(FIXTURE);
    expect(second.id).toBe('FR2');
    expect(second.text).toMatch(/^Standards grid\. For each rubric rule/);
    expect(second.text).not.toContain('**');
  });

  it('uses the number as written for the id', () => {
    expect(parseRequirements('## Functional requirements\n\n7. Seven.\n9. Nine.\n')).toEqual([
      { id: 'FR7', text: 'Seven.' },
      { id: 'FR9', text: 'Nine.' },
    ]);
  });

  it('returns nothing without the section or without a list in it', () => {
    expect(parseRequirements('# Title\n\n1. Loose item.\n')).toEqual([]);
    expect(parseRequirements('## Functional requirements\n\nProse only.\n')).toEqual([]);
  });
});

describe('readSpec', () => {
  it('is no-spec without a path', () => {
    expect(readSpec(undefined, '/nowhere')).toEqual({ status: 'no-spec' });
  });

  it('parses the requirements of an existing spec', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-spec-'));
    fs.writeFileSync(path.join(tmp, 'spec.md'), FIXTURE);
    const source = readSpec('spec.md', tmp);
    expect(source.status).toBe('ok');
    if (source.status === 'ok') expect(source.requirements.map((requirement) => requirement.id)).toEqual([ 'FR1', 'FR2', 'FR3', 'FR4' ]);
  });

  it('fails with a reason, not a throw, when the path points nowhere or the spec has no list', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-spec-'));
    expect(readSpec('missing.md', tmp)).toEqual({ status: 'failed', reason: 'Spec file not found: missing.md' });
    fs.writeFileSync(path.join(tmp, 'empty.md'), '# Nothing here\n');
    expect(readSpec('empty.md', tmp)).toMatchObject({ status: 'failed', reason: expect.stringContaining('empty.md') });
  });
});
