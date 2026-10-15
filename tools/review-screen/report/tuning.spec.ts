import { describe, expect, it } from 'vitest';

import type { FindingOriginRecord } from '../origins/match';
import type { SidecarRecord } from '../sidecar';
import { bestCellsOf, coverageTotals, nearMissRows, sweepRows } from './tuning';

const RULE = 'magic-number';
const OTHER_RULE = 'no-comments';

function labelled(id: string, file: string, line: number, rule: string | undefined = RULE, axis: string = 'standards'): FindingOriginRecord {
  return { id, axis, sources: [ 'standards' ], origin: 'axis', location: { kind: 'line', file, line }, rule, claim: undefined };
}

function record(overrides: Partial<SidecarRecord>): SidecarRecord {
  return {
    version: 1,
    createdAt: '2026-09-28T11:00:00.000Z',
    status: 'ok',
    reason: undefined,
    calibration: false,
    model: 'jev-1.13.0',
    inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [] },
    windows: [ { file: 'src/a.ts', window: 0, firstLine: 1, lastLine: 10 }, { file: 'src/a.ts', window: 1, firstLine: 40, lastLine: 60 } ],
    standards: {
      cells: [
        { rule: RULE, file: 'src/a.ts', window: 0, score: 0.3 },
        { rule: RULE, file: 'src/a.ts', window: 1, score: 0.65 },
        { rule: RULE, file: 'src/b.ts', window: 0, score: 0.8 },
        { rule: RULE, file: 'src/c.ts', window: 0, score: 0.45 },
        { rule: OTHER_RULE, file: 'src/a.ts', window: 0, score: 0.9 },
        { rule: OTHER_RULE, file: 'src/d.ts', window: 0, score: 0.2 },
      ],
      suspects: [],
      cut: 0,
    },
    spec: { status: 'no-spec' },
    calls: [],
    elapsedMs: undefined,
    origins: undefined,
    ...overrides,
  };
}

function withFindings(findings: ReadonlyArray<FindingOriginRecord>, overrides: Partial<SidecarRecord> = {}): SidecarRecord {
  return record({ origins: { recordedAt: '2026-09-28T12:00:00.000Z', findings, suspects: [] }, ...overrides });
}

describe('bestCellsOf', () => {
  it('keeps the highest window score per rule and file', () => {
    const best = bestCellsOf(record({}));
    expect(best.get(RULE)?.get('src/a.ts')).toBe(0.65);
    expect(best.get(OTHER_RULE)?.get('src/a.ts')).toBe(0.9);
    expect(best.get(RULE)?.get('src/d.ts')).toBeUndefined();
    expect(best.get('unused-rule')).toBeUndefined();
  });
});

describe('nearMissRows', () => {
  it('counts the findings labelled with the rule, those in a file the rule has no cell for, and the spread of the rest', () => {
    const records = [
      withFindings([ labelled('F1', 'src/a.ts', 5), labelled('F2', 'src/b.ts', 1), labelled('F3', 'src/z.ts', 1), labelled('F4', 'src/a.ts', 2, OTHER_RULE) ]),
      withFindings([ labelled('F1', 'src/c.ts', 3) ]),
    ];
    expect(nearMissRows(records, [ RULE, OTHER_RULE, 'unused-rule' ])).toEqual([
      { rule: RULE, labelled: 4, noCell: 1, scores: { min: 0.45, median: 0.65, max: 0.8 } },
      { rule: OTHER_RULE, labelled: 1, noCell: 0, scores: { min: 0.9, median: 0.9, max: 0.9 } },
      { rule: 'unused-rule', labelled: 0, noCell: 0, scores: undefined },
    ]);
  });

  it('takes the median of an even count as the mean of the middle two', () => {
    const records = [ withFindings([ labelled('F1', 'src/c.ts', 3), labelled('F2', 'src/b.ts', 1) ]) ];
    expect(nearMissRows(records, [ RULE ])[0].scores).toEqual({ min: 0.45, median: 0.625, max: 0.8 });
  });

  it('counts a labelled finding without a line, or one recorded without a location, as none', () => {
    const noLine: FindingOriginRecord = { ...labelled('F1', 'src/a.ts', 5), location: { kind: 'none' } };
    const unlocated: FindingOriginRecord = { ...labelled('F2', 'src/a.ts', 5), location: undefined };
    expect(nearMissRows([ withFindings([ noLine, unlocated ]) ], [ RULE ])[0]).toEqual({ rule: RULE, labelled: 0, noCell: 0, scores: undefined });
  });

  it('reads nothing from a record whose origins were never recorded', () => {
    expect(nearMissRows([ record({}) ], [ RULE ])[0]).toEqual({ rule: RULE, labelled: 0, noCell: 0, scores: undefined });
  });
});

describe('sweepRows', () => {
  it('splits every best cell of the rule into hit, noise or missed at each threshold', () => {
    const records = [ withFindings([ labelled('F1', 'src/a.ts', 5), labelled('F2', 'src/c.ts', 1), labelled('F3', 'src/z.ts', 1) ]) ];
    const thresholdOf = (rule: string): number => rule === RULE ? 0.6 : 0.7;
    expect(sweepRows(records, [ RULE, OTHER_RULE ], [ 0.4, 0.5, 0.7 ], thresholdOf)).toEqual([
      { rule: RULE, threshold: 0.6, at: [
        { threshold: 0.4, hit: 2, noise: 1, missed: 0 },
        { threshold: 0.5, hit: 1, noise: 1, missed: 1 },
        { threshold: 0.7, hit: 0, noise: 1, missed: 2 },
      ] },
      { rule: OTHER_RULE, threshold: 0.7, at: [
        { threshold: 0.4, hit: 0, noise: 1, missed: 0 },
        { threshold: 0.5, hit: 0, noise: 1, missed: 0 },
        { threshold: 0.7, hit: 0, noise: 1, missed: 0 },
      ] },
    ]);
  });

  it('counts a cell exactly at the threshold as over it', () => {
    const records = [ withFindings([ labelled('F1', 'src/a.ts', 5) ]) ];
    expect(sweepRows(records, [ RULE ], [ 0.65 ], () => 0.7)[0].at[0]).toEqual({ threshold: 0.65, hit: 1, noise: 1, missed: 0 });
    expect(sweepRows(records, [ RULE ], [ 0.1 ], () => 0.7)[0].at[0]).toEqual({ threshold: 0.1, hit: 1, noise: 2, missed: 0 });
  });

  it('labels a file by a finding of the same rule only, per review', () => {
    const first = withFindings([ labelled('F1', 'src/a.ts', 5, OTHER_RULE) ]);
    const second = withFindings([ labelled('F1', 'src/a.ts', 5) ]);
    expect(sweepRows([ first, second ], [ RULE ], [ 0.6 ], () => 0.7)[0].at[0]).toEqual({ threshold: 0.6, hit: 1, noise: 3, missed: 0 });
  });
});

describe('coverageTotals', () => {
  it('counts standards findings in a file with no cell, on a line outside every window, or recorded without a location', () => {
    const findings: ReadonlyArray<FindingOriginRecord> = [
      labelled('F1', 'src/a.ts', 5),
      labelled('F2', 'src/a.ts', 20),
      labelled('F3', 'src/z.ts', 1),
      { ...labelled('F4', 'src/a.ts', 5), location: undefined },
      { ...labelled('F5', 'src/a.ts', 5), location: { kind: 'none' } },
      labelled('F6', 'src/z.ts', 1, undefined, 'correctness'),
      labelled('F7', 'src/b.ts', 5),
    ];
    expect(coverageTotals([ withFindings(findings) ])).toEqual({ standardsFindings: 6, noCell: 1, outsideWindows: 2, unlocated: 1 });
  });

  it('takes a line on a window edge as inside it', () => {
    expect(coverageTotals([ withFindings([ labelled('F1', 'src/a.ts', 10), labelled('F2', 'src/a.ts', 40), labelled('F3', 'src/a.ts', 11) ]) ]))
      .toMatchObject({ outsideWindows: 1 });
  });

  it('is all zero with no counted review', () => {
    expect(coverageTotals([])).toEqual({ standardsFindings: 0, noCell: 0, outsideWindows: 0, unlocated: 0 });
  });
});
