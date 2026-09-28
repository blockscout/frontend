import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { parseArgs, recordOrigins } from './index';
import type { SidecarRecord } from './sidecar';
import { readSidecar, writeSidecar } from './sidecar';

interface OriginsOutput {
  readonly findings: ReadonlyArray<{ readonly id: string; readonly origin: string }>;
  readonly suspects: ReadonlyArray<Record<string, string>>;
}

function runOrigins(sidecar: string, findings: string): OriginsOutput {
  return recordOrigins(sidecar, () => findings) as OriginsOutput;
}

describe('parseArgs', () => {
  it('defaults to the branch scope with nothing explicit', () => {
    expect(parseArgs([])).toEqual({
      scope: 'branch',
      base: undefined,
      spec: undefined,
      ticket: undefined,
      origins: undefined,
      findings: undefined,
      calibration: false,
    });
  });

  it('reads every flag in both the separate-token and inline forms', () => {
    expect(parseArgs([ '--scope', 'uncommitted', '--base', 'abc123', '--spec', 's.md', '--ticket', '02' ])).toEqual({
      scope: 'uncommitted',
      base: 'abc123',
      spec: 's.md',
      ticket: '02',
      origins: undefined,
      findings: undefined,
      calibration: false,
    });
    expect(parseArgs([ '--scope=uncommitted', '--base=abc123' ])).toMatchObject({ scope: 'uncommitted', base: 'abc123' });
  });

  it('marks a calibration run with the bare switch', () => {
    expect(parseArgs([ '--calibration', '--base', 'abc123' ])).toMatchObject({ calibration: true, base: 'abc123' });
    expect(() => parseArgs([ '--calibration=yes' ])).toThrow('--calibration takes no value');
  });

  it('reads --origins with --findings, and rejects one without the other', () => {
    expect(parseArgs([ '--origins', '.ai/jev/x.json', '--findings', '-' ])).toMatchObject({ origins: '.ai/jev/x.json', findings: '-' });
    expect(() => parseArgs([ '--origins', '.ai/jev/x.json' ])).toThrow(/--origins and --findings go together\nUsage:/);
    expect(() => parseArgs([ '--findings', 'f.md' ])).toThrow('--origins and --findings go together');
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

describe('--origins', () => {
  let tmp = '';

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = '';
  });

  it('rewrites the sidecar with an origins block, and a second run replaces it rather than appending', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-origins-'));
    const sidecar = path.join(tmp, 'x.json');
    const record: SidecarRecord = {
      version: 1,
      createdAt: '2026-09-28T23:30:00.000Z',
      status: 'ok',
      reason: undefined,
      calibration: false,
      model: 'jev-1.13.0',
      inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [ { path: 'src/a.ts', untracked: false } ] },
      windows: [ { file: 'src/a.ts', window: 0, firstLine: 1, lastLine: 20 } ],
      standards: { cells: [], suspects: [ { rule: 'no-comments', file: 'src/a.ts', line: 4, score: 0.9, window: 0 } ], cut: 0 },
      spec: { status: 'no-spec' },
      calls: [],
      origins: undefined,
    };
    writeSidecar(sidecar, record);

    const first = runOrigins(sidecar, '| id | axis | location | sources |\n| --- | --- | --- | --- |\n| F1 | standards | `src/a.ts:6` | jev |\n');
    expect(first.suspects).toEqual([ { suspect: 'no-comments src/a.ts:4', fate: 'confirmed', finding: 'F1' } ]);
    const afterFirst = readSidecar(sidecar);
    expect(afterFirst).toMatchObject({
      status: 'ok',
      windows: record.windows,
      standards: record.standards,
      origins: { findings: [ { id: 'F1', origin: 'jev' } ], suspects: [ { fate: 'confirmed', finding: 'F1' } ] },
    });

    const second = runOrigins(sidecar, JSON.stringify([ { id: 'F9', axis: 'spec', location: '—', sources: [ 'spec' ] } ]));
    expect(second.findings).toEqual([ { id: 'F9', origin: 'axis' } ]);
    const afterSecond = readSidecar(sidecar);
    expect(afterSecond.origins?.findings).toEqual([ { id: 'F9', axis: 'spec', sources: [ 'spec' ], origin: 'axis' } ]);
    expect(afterSecond.origins?.suspects).toEqual([
      { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/a.ts', line: 4 }, score: 0.9, fate: 'dropped', reason: 'not reported' },
    ]);
    expect(Object.keys(afterSecond)).toEqual(Object.keys(afterFirst));
  });
});
