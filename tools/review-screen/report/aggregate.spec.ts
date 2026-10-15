import { describe, expect, it } from 'vitest';

import type { OriginsRecord, SuspectFateRecord } from '../origins/match';
import type { SidecarRecord } from '../sidecar';
import type { SidecarFile } from './aggregate';
import { addedSecondsOf, aggregateReport, inputTokensOf } from './aggregate';

const RULES = {
  ids: [ 'explanatory-comment', 'magic-number' ],
  thresholdOf: (rule: string) => rule === 'magic-number' ? 0.6 : 0.7,
  sweepThresholds: [ 0.5, 0.7 ],
};

function call(ms: number, inputTokens: number): SidecarRecord['calls'][number] {
  return { kind: 'noul', file: 'src/a.ts', window: 0, ms, usage: { input_tokens: inputTokens, output_tokens: 10 } };
}

function standardsSuspect(rule: string, fate: SuspectFateRecord['fate'], reasonOrFinding: string = 'F1'): SuspectFateRecord {
  const suspect = { kind: 'standards' as const, rule, file: 'src/a.ts', line: 5 };
  if (fate === 'dropped') return { suspect, score: 0.8, fate, reason: reasonOrFinding };
  return { suspect, score: 0.8, fate, finding: reasonOrFinding };
}

function specSuspect(fate: SuspectFateRecord['fate'], reasonOrFinding: string = 'F1'): SuspectFateRecord {
  const suspect = { kind: 'spec' as const, requirement: 'FR1' };
  if (fate === 'dropped') return { suspect, score: 0.3, fate, reason: reasonOrFinding };
  return { suspect, score: 0.3, fate, finding: reasonOrFinding };
}

function origins(
  suspects: ReadonlyArray<SuspectFateRecord>,
  findingOrigins: ReadonlyArray<OriginsRecord['findings'][number]['origin']> = [],
): OriginsRecord {
  return {
    recordedAt: '2026-09-28T12:00:00.000Z',
    findings: findingOrigins.map((origin, index) => ({
      id: `F${ index + 1 }`,
      axis: 'standards',
      sources: [ 'jev' ],
      origin,
      location: undefined,
      rule: undefined,
      claim: undefined,
    })),
    suspects,
  };
}

function sidecar(file: string, overrides: Partial<SidecarRecord> = {}): SidecarFile {
  return {
    file,
    record: {
      version: 1,
      createdAt: '2026-09-28T11:00:00.000Z',
      status: 'ok',
      reason: undefined,
      calibration: false,
      model: 'jev-1.13.0',
      inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [] },
      windows: [],
      standards: { cells: [], suspects: [], cut: 0 },
      spec: { status: 'no-spec' },
      calls: [],
      elapsedMs: undefined,
      origins: undefined,
      ...overrides,
    },
  };
}

describe('aggregateReport', () => {
  it('leaves calibration runs out and lists reviews without origins as pending, counting neither', () => {
    const report = aggregateReport([
      sidecar('calibration.json', {
        calibration: true,
        origins: origins([ standardsSuspect('magic-number', 'confirmed') ], [ 'jev' ]),
        calls: [ call(9000, 100) ],
      }),
      sidecar('pending.json', { calls: [ call(9000, 100) ] }),
      sidecar('calibration-pending.json', { calibration: true }),
      sidecar('counted.json', { origins: origins([]) }),
    ], RULES);

    expect(report.pending).toEqual([ 'pending.json' ]);
    expect(report.totals).toEqual({
      reviews: 1,
      pending: 1,
      findings: { jev: 0, axis: 0, both: 0 },
      addedSeconds: { mean: 0, max: 0 },
      meanInputTokens: 0,
    });
    expect(report.rules.every((row) => row.sent === 0)).toBe(true);
  });

  it('aggregates fates per rule across reviews, spec suspects as one row, with the most frequent drop reason', () => {
    const report = aggregateReport([
      sidecar('one.json', { origins: origins([
        standardsSuspect('magic-number', 'confirmed'),
        standardsSuspect('magic-number', 'dropped', 'pre-existing'),
        standardsSuspect('magic-number', 'dropped', 'not reported'),
        specSuspect('dropped', 'outside the diff'),
      ]) }),
      sidecar('two.json', { origins: origins([
        standardsSuspect('magic-number', 'dropped', 'pre-existing'),
        standardsSuspect('magic-number', 'merged'),
        standardsSuspect('legacy-rule', 'confirmed'),
        specSuspect('confirmed'),
      ]) }),
    ], RULES);

    expect(report.rules).toEqual([
      { rule: 'explanatory-comment', sent: 0, confirmed: 0, merged: 0, dropped: 0, topDropReason: undefined },
      { rule: 'magic-number', sent: 5, confirmed: 1, merged: 1, dropped: 3, topDropReason: 'pre-existing' },
      { rule: 'legacy-rule', sent: 1, confirmed: 1, merged: 0, dropped: 0, topDropReason: undefined },
      { rule: 'spec', sent: 2, confirmed: 1, merged: 0, dropped: 1, topDropReason: 'outside the diff' },
    ]);
  });

  it('picks the most frequent drop reason even when it is seen after a rarer one', () => {
    const report = aggregateReport([
      sidecar('one.json', { origins: origins([
        standardsSuspect('magic-number', 'dropped', 'rare'),
        standardsSuspect('magic-number', 'dropped', 'common'),
        standardsSuspect('magic-number', 'dropped', 'common'),
      ]) }),
    ], RULES);

    expect(report.rules[1].topDropReason).toBe('common');
  });

  it('keeps the first-seen reason when drop reasons tie', () => {
    const report = aggregateReport([
      sidecar('one.json', { origins: origins([
        standardsSuspect('magic-number', 'dropped', 'second'),
        standardsSuspect('magic-number', 'dropped', 'first'),
        standardsSuspect('magic-number', 'dropped', 'first'),
        standardsSuspect('magic-number', 'dropped', 'second'),
      ]) }),
    ], RULES);

    expect(report.rules[1].topDropReason).toBe('second');
  });

  it('counts finding origins across reviews, including a skipped review whose findings are all axis', () => {
    const report = aggregateReport([
      sidecar('one.json', { origins: origins([], [ 'jev', 'both', 'axis' ]) }),
      sidecar('skipped.json', { status: 'skipped', reason: 'no key', origins: origins([], [ 'axis', 'axis' ]) }),
    ], RULES);

    expect(report.totals.reviews).toBe(2);
    expect(report.totals.findings).toEqual({ jev: 1, axis: 3, both: 1 });
  });

  it('reports zero seconds and tokens when no review is counted', () => {
    const report = aggregateReport([ sidecar('pending.json', { calls: [ call(9000, 100) ] }) ], RULES);

    expect(report.totals).toEqual({
      reviews: 0,
      pending: 1,
      findings: { jev: 0, axis: 0, both: 0 },
      addedSeconds: { mean: 0, max: 0 },
      meanInputTokens: 0,
    });
  });

  it('reports the wall-clock seconds per review as mean and max, and the mean input tokens', () => {
    const report = aggregateReport([
      sidecar('one.json', { origins: origins([]), elapsedMs: 2000, calls: [ call(1500, 600), call(1500, 400) ] }),
      sidecar('two.json', { origins: origins([]), elapsedMs: 6000, calls: [ call(6000, 3000) ] }),
      sidecar('skipped.json', { status: 'skipped', reason: 'no key', origins: origins([]) }),
    ], RULES);

    expect(report.totals.addedSeconds).toEqual({ mean: (2 + 6 + 0) / 3, max: 6 });
    expect(report.totals.meanInputTokens).toBe((1000 + 3000 + 0) / 3);
  });
});

function labelledFinding(id: string, file: string, claim: string | undefined): OriginsRecord['findings'][number] {
  return { id, axis: 'standards', sources: [ 'standards' ], origin: 'axis', location: { kind: 'line', file, line: 5 }, rule: 'magic-number', claim };
}

describe('aggregateReport tuning rows', () => {
  it('carries the per-rule near misses, the sweep at the given thresholds and the coverage totals', () => {
    const report = aggregateReport([
      sidecar('one.json', {
        windows: [ { file: 'src/a.ts', window: 0, firstLine: 1, lastLine: 20 } ],
        standards: { cells: [ { rule: 'magic-number', file: 'src/a.ts', window: 0, score: 0.55 } ], suspects: [], cut: 0 },
        origins: {
          recordedAt: '2026-09-28T12:00:00.000Z',
          findings: [
            labelledFinding('F1', 'src/a.ts', 'A bare 4.'),
            labelledFinding('F2', 'src/b.ts', undefined),
          ],
          suspects: [],
        },
      }),
    ], RULES);

    expect(report.nearMisses).toEqual([
      { rule: 'explanatory-comment', labelled: 0, noCell: 0, scores: undefined },
      { rule: 'magic-number', labelled: 2, noCell: 1, scores: { min: 0.55, median: 0.55, max: 0.55 } },
    ]);
    expect(report.sweep).toEqual([
      { rule: 'explanatory-comment', threshold: 0.7, at: [ { threshold: 0.5, hit: 0, noise: 0, missed: 0 }, { threshold: 0.7, hit: 0, noise: 0, missed: 0 } ] },
      { rule: 'magic-number', threshold: 0.6, at: [ { threshold: 0.5, hit: 1, noise: 0, missed: 0 }, { threshold: 0.7, hit: 0, noise: 0, missed: 1 } ] },
    ]);
    expect(report.coverage).toEqual({ standardsFindings: 2, noCell: 1, outsideWindows: 0, unlocated: 0 });
  });

  it('reads only counted reviews into the tuning rows, never a calibration or pending one', () => {
    const labelled: OriginsRecord = { recordedAt: '2026-09-28T12:00:00.000Z', findings: [ labelledFinding('F1', 'src/a.ts', undefined) ], suspects: [] };
    const cells = [ { rule: 'magic-number', file: 'src/a.ts', window: 0, score: 0.9 } ];
    const report = aggregateReport([
      sidecar('calibration.json', { calibration: true, origins: labelled, standards: { cells, suspects: [], cut: 0 } }),
      sidecar('pending.json', { standards: { cells, suspects: [], cut: 0 } }),
    ], RULES);

    expect(report.nearMisses[1]).toEqual({ rule: 'magic-number', labelled: 0, noCell: 0, scores: undefined });
    expect(report.sweep[1].at).toEqual([ { threshold: 0.5, hit: 0, noise: 0, missed: 0 }, { threshold: 0.7, hit: 0, noise: 0, missed: 0 } ]);
    expect(report.coverage).toEqual({ standardsFindings: 0, noCell: 0, outsideWindows: 0, unlocated: 0 });
  });
});

describe('per-review sums', () => {
  it('reads the wall-clock span in seconds, not the sum of the overlapping calls', () => {
    const { record } = sidecar('one.json', { elapsedMs: 1500, calls: [ call(1000, 100), call(1000, 250) ] });
    expect(addedSecondsOf(record)).toBe(1.5);
    expect(inputTokensOf(record)).toBe(350);
  });

  it('falls back to the summed call timings for a sidecar written without a span', () => {
    const { record } = sidecar('old.json', { calls: [ call(250, 100), call(750, 250) ] });
    expect(addedSecondsOf(record)).toBe(1);
  });
});
