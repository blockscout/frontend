import { describe, expect, it } from 'vitest';

import type { SidecarRecord } from '../sidecar';
import { assignOrigins, originOf } from './match';
import type { FindingRow, OriginsInput } from './parse';
import { parseLocation } from './parse';

const RECORDED_AT = '2026-09-28T23:30:00.000Z';

function finding(id: string, location: string, sources: ReadonlyArray<string>, axis: string = 'standards'): FindingRow {
  return { id, axis, location: parseLocation(location), sources };
}

function record(overrides: Partial<SidecarRecord> = {}): SidecarRecord {
  return {
    version: 1,
    createdAt: RECORDED_AT,
    status: 'ok',
    reason: undefined,
    model: 'jev-1.13.0',
    inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [] },
    windows: [
      { file: 'src/a.ts', window: 0, firstLine: 10, lastLine: 30 },
      { file: 'src/a.ts', window: 1, firstLine: 80, lastLine: 95 },
      { file: 'src/b.ts', window: 0, firstLine: 1, lastLine: 12 },
    ],
    standards: {
      cells: [],
      suspects: [
        { rule: 'no-comments', file: 'src/a.ts', line: 12, score: 0.91, window: 0 },
        { rule: 'magic-number', file: 'src/a.ts', line: 90, score: 0.8, window: 1 },
        { rule: 'no-comments', file: 'src/b.ts', line: 3, score: 0.75, window: 0 },
      ],
      cut: 0,
    },
    spec: {
      status: 'ok',
      requirements: [ { id: 'FR1', text: 'one' }, { id: 'FR2', text: 'two' } ],
      cells: [],
      suspects: [
        { requirement: 'FR1', file: 'src/a.ts', line: '—', score: 0.1 },
        { requirement: 'FR2', file: 'src/b.ts', line: '—', score: 0.2 },
      ],
      cut: 0,
    },
    calls: [],
    elapsedMs: undefined,
    origins: undefined,
    calibration: false,
    ...overrides,
  };
}

describe('originOf', () => {
  it('is jev when only jev raised it, axis when jev did not, both otherwise', () => {
    expect(originOf([ 'jev' ])).toBe('jev');
    expect(originOf([ 'jev', 'jev' ])).toBe('jev');
    expect(originOf([ 'standards' ])).toBe('axis');
    expect(originOf([])).toBe('axis');
    expect(originOf([ 'standards', 'jev' ])).toBe('both');
  });
});

describe('assignOrigins', () => {
  it('confirms a suspect a jev-only finding lands in its window, merges one shared with an axis, and drops the rest', () => {
    const input: OriginsInput = {
      findings: [
        finding('F1', 'src/a.ts:25', [ 'jev' ]),
        finding('F2', 'src/a.ts:85', [ 'standards', 'jev' ]),
        finding('F3', 'src/b.ts:3', [ 'standards' ]),
        finding('F4', 'FR1', [ 'jev' ], 'spec'),
      ],
      drops: [ { suspect: { kind: 'spec', requirement: 'FR2' }, reason: 'covered by the PR description' } ],
    };
    const origins = assignOrigins(record(), input, RECORDED_AT);
    expect(origins.recordedAt).toBe(RECORDED_AT);
    expect(origins.findings).toEqual([
      { id: 'F1', axis: 'standards', sources: [ 'jev' ], origin: 'jev' },
      { id: 'F2', axis: 'standards', sources: [ 'standards', 'jev' ], origin: 'both' },
      { id: 'F3', axis: 'standards', sources: [ 'standards' ], origin: 'axis' },
      { id: 'F4', axis: 'spec', sources: [ 'jev' ], origin: 'jev' },
    ]);
    expect(origins.suspects).toEqual([
      { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/a.ts', line: 12 }, score: 0.91, fate: 'confirmed', finding: 'F1' },
      { suspect: { kind: 'standards', rule: 'magic-number', file: 'src/a.ts', line: 90 }, score: 0.8, fate: 'merged', finding: 'F2' },
      { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/b.ts', line: 3 }, score: 0.75, fate: 'dropped', reason: 'not reported' },
      { suspect: { kind: 'spec', requirement: 'FR1' }, score: 0.1, fate: 'confirmed', finding: 'F4' },
      { suspect: { kind: 'spec', requirement: 'FR2' }, score: 0.2, fate: 'dropped', reason: 'covered by the PR description' },
    ]);
  });

  it('gives each finding to one suspect only, the nearest by located line, when two suspects share a window', () => {
    const shared = record({
      standards: {
        cells: [],
        suspects: [
          { rule: 'no-comments', file: 'src/a.ts', line: 12, score: 0.91, window: 0 },
          { rule: 'magic-number', file: 'src/a.ts', line: 28, score: 0.8, window: 0 },
        ],
        cut: 0,
      },
      spec: { status: 'no-spec' },
    });
    // For the first suspect (line 12): F1 is 15 away, F2 and F3 both 2 away, F4 is 4 away. The nearest
    // wins regardless of its position in the list, and an earlier row wins a tie.
    const input: OriginsInput = {
      findings: [
        finding('F1', 'src/a.ts:27', [ 'standards', 'jev' ]),
        finding('F2', 'src/a.ts:14', [ 'jev' ]),
        finding('F3', 'src/a.ts:10', [ 'jev' ]),
        finding('F4', 'src/a.ts:16', [ 'jev' ]),
      ],
      drops: [],
    };
    const fates = assignOrigins(shared, input, RECORDED_AT).suspects;
    expect(fates).toEqual([
      { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/a.ts', line: 12 }, score: 0.91, fate: 'confirmed', finding: 'F2' },
      { suspect: { kind: 'standards', rule: 'magic-number', file: 'src/a.ts', line: 28 }, score: 0.8, fate: 'merged', finding: 'F1' },
    ]);

    const oneFinding: OriginsInput = { findings: [ finding('F1', 'src/a.ts:20', [ 'jev' ]) ], drops: [] };
    expect(assignOrigins(shared, oneFinding, RECORDED_AT).suspects.map((entry) => entry.fate)).toEqual([ 'confirmed', 'dropped' ]);
  });

  it('matches by the window span, not the located line, and never across files', () => {
    // F2 sits inside src/a.ts window 0 by line number only: it is in another file, so it belongs to no
    // src/a.ts suspect, and it is outside src/b.ts window 0, so it belongs to no src/b.ts suspect either.
    const input: OriginsInput = {
      findings: [ finding('F1', 'src/a.ts:30', [ 'jev' ]), finding('F2', 'src/b.ts:20', [ 'jev' ]), finding('F3', 'src/b.ts:5', [ 'jev' ]) ],
      drops: [],
    };
    const fates = assignOrigins(record(), input, RECORDED_AT).suspects;
    expect(fates).toMatchObject([
      { fate: 'confirmed', finding: 'F1' },
      { fate: 'dropped', reason: 'not reported' },
      { fate: 'confirmed', finding: 'F3' },
      { fate: 'dropped', reason: 'not reported' },
      { fate: 'dropped', reason: 'not reported' },
    ]);

    // Alone, F2 is still past the end of src/b.ts window 0, and one on its last line is in.
    const past: OriginsInput = { findings: [ finding('F2', 'src/b.ts:20', [ 'jev' ]) ], drops: [] };
    expect(assignOrigins(record(), past, RECORDED_AT).suspects[2]).toMatchObject({ fate: 'dropped', reason: 'not reported' });
    const last: OriginsInput = { findings: [ finding('F2', 'src/b.ts:12', [ 'jev' ]) ], drops: [] };
    expect(assignOrigins(record(), last, RECORDED_AT).suspects[2]).toMatchObject({ fate: 'confirmed', finding: 'F2' });
  });

  it('matches a spec suspect on its requirement id only, never on a line finding', () => {
    const input: OriginsInput = {
      findings: [ finding('F1', 'FR2', [ 'jev' ], 'spec'), finding('F2', 'FR1', [ 'jev' ], 'spec'), finding('F3', 'src/b.ts:3', [ 'jev' ]) ],
      drops: [],
    };
    const fates = assignOrigins(record(), input, RECORDED_AT).suspects;
    expect(fates.slice(3)).toMatchObject([
      { suspect: { kind: 'spec', requirement: 'FR1' }, fate: 'confirmed', finding: 'F2' },
      { suspect: { kind: 'spec', requirement: 'FR2' }, fate: 'confirmed', finding: 'F1' },
    ]);
  });

  it('matches on the exact line when the sidecar has no window spans', () => {
    const input: OriginsInput = { findings: [ finding('F1', 'src/a.ts:12', [ 'jev' ]), finding('F2', 'src/a.ts:13', [ 'jev' ]) ], drops: [] };
    const fates = assignOrigins(record({ windows: [] }), input, RECORDED_AT).suspects;
    expect(fates[0]).toMatchObject({ fate: 'confirmed', finding: 'F1' });
    expect(fates[1]).toMatchObject({ fate: 'dropped', reason: 'not reported' });
  });

  it('records the drop reason over a matching finding, and an empty reason as given', () => {
    const input: OriginsInput = {
      findings: [ finding('F1', 'src/a.ts:12', [ 'jev' ]) ],
      drops: [ { suspect: { kind: 'standards', rule: 'no-comments', file: 'src/a.ts', line: 12 }, reason: '' } ],
    };
    expect(assignOrigins(record(), input, RECORDED_AT).suspects[0]).toMatchObject({ fate: 'dropped', reason: '' });
  });

  it('still classifies every finding as axis on a skipped run with no suspects', () => {
    const skipped = record({
      status: 'skipped',
      reason: 'no key',
      standards: { cells: [], suspects: [], cut: 0 },
      spec: { status: 'skipped', reason: 'no key' },
    });
    const input: OriginsInput = { findings: [ finding('F1', 'src/a.ts:12', [ 'standards' ]), finding('F2', '—', [ 'spec' ], 'spec') ], drops: [] };
    const origins = assignOrigins(skipped, input, RECORDED_AT);
    expect(origins.findings.map((entry) => entry.origin)).toEqual([ 'axis', 'axis' ]);
    expect(origins.suspects).toEqual([]);
  });
});
