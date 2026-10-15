import { describe, expect, it } from 'vitest';

import type { PilotReport } from './aggregate';
import { renderReport, renderReportJson, renderTable } from './render';

const REPORT: PilotReport = {
  rules: [
    { rule: 'magic-number', sent: 5, confirmed: 1, merged: 1, dropped: 3, topDropReason: 'pre-existing' },
    { rule: 'spec', sent: 0, confirmed: 0, merged: 0, dropped: 0, topDropReason: undefined },
  ],
  nearMisses: [
    { rule: 'magic-number', labelled: 3, noCell: 1, scores: { min: 0.4, median: 0.625, max: 0.8 } },
    { rule: 'no-comments', labelled: 0, noCell: 0, scores: undefined },
  ],
  sweep: [
    { rule: 'magic-number', threshold: 0.7, at: [ { threshold: 0.5, hit: 2, noise: 1, missed: 0 }, { threshold: 0.7, hit: 1, noise: 0, missed: 1 } ] },
    { rule: 'no-comments', threshold: 0.5, at: [ { threshold: 0.5, hit: 0, noise: 0, missed: 0 }, { threshold: 0.7, hit: 0, noise: 0, missed: 0 } ] },
  ],
  coverage: { standardsFindings: 4, noCell: 1, outsideWindows: 1, unlocated: 2 },
  totals: {
    reviews: 2,
    pending: 1,
    findings: { jev: 1, axis: 3, both: 1 },
    addedSeconds: { mean: 4.25, max: 6 },
    meanInputTokens: 1333.4,
  },
  pending: [ '2026-09-28-issue-1-branch.json' ],
};

describe('renderTable', () => {
  it('pads every column to its widest cell and never leaves trailing spaces', () => {
    expect(renderTable([ 'a', 'bb' ], [ [ 'xxx', 'y' ] ])).toBe('a    bb\n---  --\nxxx  y');
  });
});

describe('renderReport', () => {
  it('prints the rule table, the totals and the pending list', () => {
    expect(renderReport(REPORT)).toBe([
      'rule          sent  confirmed  merged  dropped  top drop reason',
      '------------  ----  ---------  ------  -------  ---------------',
      'magic-number  5     1          1       3        pre-existing',
      'spec          0     0          0       0        —',
      '',
      'rule          labelled  no cell  file score min / median / max',
      '------------  --------  -------  -----------------------------',
      'magic-number  3         1        0.40 / 0.63 / 0.80',
      'no-comments   0         0        —',
      '',
      'rule          threshold  0.5 hit/noise/missed  0.7 hit/noise/missed',
      '------------  ---------  --------------------  --------------------',
      'magic-number  0.7        2/1/0                 1/0/1',
      'no-comments   0.5        0/0/0                 0/0/0',
      '',
      'reviews: 2 counted · 1 pending origins',
      'findings: jev 1 / axis 3 / both 1',
      'added seconds per review: mean 4.3 · max 6.0',
      'input tokens per review: mean 1333',
      'coverage: 4 standards findings · 1 in a file with no cell · 1 on a line outside every window · 2 with no location recorded',
      '',
      'pending origins:',
      '  2026-09-28-issue-1-branch.json',
    ].join('\n'));
  });

  it('clips a long drop reason and omits the pending section when nothing is pending', () => {
    const reason = 'x'.repeat(80);
    const output = renderReport({ ...REPORT, pending: [], rules: [ { ...REPORT.rules[0], topDropReason: reason } ] });
    expect(output).toContain(`  ${ 'x'.repeat(59) }…\n`);
    expect(output).not.toContain(reason);
    expect(output).not.toContain('pending origins:');
  });

  it('keeps a drop reason that just fits and clips one a character longer', () => {
    const fits = 'y'.repeat(60);
    const longer = 'z'.repeat(61);
    const output = renderReport({ ...REPORT, pending: [], rules: [
      { ...REPORT.rules[0], topDropReason: fits },
      { ...REPORT.rules[1], topDropReason: longer },
    ] });
    expect(output).toContain(`  ${ fits }\n`);
    expect(output).toContain(`  ${ 'z'.repeat(59) }…`);
    expect(output).not.toContain(longer);
  });
});

describe('renderReport with no sweep rows', () => {
  it('prints the sweep table header with the rule and threshold columns only', () => {
    expect(renderReport({ ...REPORT, sweep: [], pending: [] })).toContain('rule  threshold\n----  ---------\n');
  });
});

describe('renderReportJson', () => {
  it('is the report itself, pretty-printed', () => {
    expect(JSON.parse(renderReportJson(REPORT))).toEqual(REPORT);
  });
});
