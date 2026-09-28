import fs from 'fs';
import os from 'os';
import path from 'path';

import { TypeSafeClient } from '@typesafe-ai/sdk';

import { afterEach, describe, expect, it } from 'vitest';

import type { Screened } from './index';
import { parseArgs, printReport, recordOrigins, specRecordOf } from './index';
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
      report: false,
      json: false,
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
      report: false,
      json: false,
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

  it('reads --report with an optional --json, and rejects --json on its own', () => {
    expect(parseArgs([ '--report' ])).toMatchObject({ report: true, json: false });
    expect(parseArgs([ '--report', '--json' ])).toMatchObject({ report: true, json: true });
    expect(() => parseArgs([ '--json' ])).toThrow(/--json goes with --report\nUsage:/);
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

describe('specRecordOf', () => {
  const client: Screened['client'] = { ok: true, client: new TypeSafeClient({ apiKey: 'test' }) };
  const empty = { cells: [], suspects: [], cut: 0, calls: [], model: undefined, failure: undefined };
  const source: Screened['source'] = { status: 'ok', path: 'spec.md', requirements: [ { id: 'FR1', text: 'one' } ] };

  it('skips the spec grid, saying why, when the task-folder exclusion leaves no file to score', () => {
    const screened: Screened = { client, source, windows: [], specFiles: 0, standards: empty, spec: empty, elapsedMs: 0 };
    expect(specRecordOf(screened)).toEqual({ status: 'skipped', reason: 'no touched file outside .agents/tasks/** to score' });
  });

  it('reports every requirement covered only when at least one file was scored', () => {
    const screened: Screened = { client, source, windows: [], specFiles: 1, standards: empty, spec: empty, elapsedMs: 0 };
    expect(specRecordOf(screened)).toEqual({ status: 'ok', requirements: source.requirements, cells: [], suspects: [], cut: 0 });
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
      elapsedMs: undefined,
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

describe('--report', () => {
  let tmp = '';

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = '';
  });

  function pilotRecord(overrides: Partial<SidecarRecord>): SidecarRecord {
    return {
      version: 1,
      createdAt: '2026-09-28T23:30:00.000Z',
      status: 'ok',
      reason: undefined,
      calibration: false,
      model: 'jev-1.13.0',
      inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [] },
      windows: [],
      standards: { cells: [], suspects: [], cut: 0 },
      spec: { status: 'no-spec' },
      calls: [ { kind: 'noul', file: 'src/a.ts', window: 0, ms: 2000, usage: { input_tokens: 500, output_tokens: 10 } } ],
      elapsedMs: 2000,
      origins: undefined,
      ...overrides,
    };
  }

  it('prints an empty table when the sidecar folder does not exist yet', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-report-'));
    const output = printReport(path.join(tmp, 'missing'), false);
    expect(output).toContain('reviews: 0 counted · 0 pending origins');
    expect(output).toMatch(/^explanatory-comment\s+0\s+0\s+0\s+0\s+—$/m);
  });

  it('reads every sidecar in the folder, in name order, and prints the same data as text or JSON', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-report-'));
    writeSidecar(path.join(tmp, '2026-09-28-b-branch.json'), pilotRecord({}));
    writeSidecar(path.join(tmp, '2026-09-27-a-branch.json'), pilotRecord({ origins: {
      recordedAt: '2026-09-27T00:00:00.000Z',
      findings: [ { id: 'F1', axis: 'standards', sources: [ 'jev' ], origin: 'jev' } ],
      suspects: [ { suspect: { kind: 'standards', rule: 'magic-number', file: 'src/a.ts', line: 4 }, score: 0.9, fate: 'confirmed', finding: 'F1' } ],
    } }));
    writeSidecar(path.join(tmp, 'calibration.json'), pilotRecord({ calibration: true }));
    fs.writeFileSync(path.join(tmp, 'notes.txt'), 'ignored');

    const text = printReport(tmp, false);
    expect(text).toMatch(/^magic-number\s+1\s+1\s+0\s+0\s+—$/m);
    expect(text).toContain('reviews: 1 counted · 1 pending origins');
    expect(text).toContain('findings: jev 1 / axis 0 / both 0');
    expect(text).toContain('added seconds per review: mean 2.0 · max 2.0');
    expect(text).toContain('input tokens per review: mean 500');
    expect(text).toContain('  2026-09-28-b-branch.json');

    expect(JSON.parse(printReport(tmp, true))).toMatchObject({
      rules: expect.arrayContaining([ { rule: 'magic-number', sent: 1, confirmed: 1, merged: 0, dropped: 0, topDropReason: undefined } ]),
      totals: { reviews: 1, pending: 1, findings: { jev: 1, axis: 0, both: 0 }, addedSeconds: { mean: 2, max: 2 }, meanInputTokens: 500 },
      pending: [ '2026-09-28-b-branch.json' ],
    });
  });
});
