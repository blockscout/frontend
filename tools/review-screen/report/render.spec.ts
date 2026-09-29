import { describe, expect, it } from 'vitest';

import type { PilotReport } from './aggregate';
import { renderReport, renderReportJson, renderTable } from './render';

const REPORT: PilotReport = {
  rules: [
    { rule: 'magic-number', sent: 5, confirmed: 1, merged: 1, dropped: 3, topDropReason: 'pre-existing' },
    { rule: 'spec', sent: 0, confirmed: 0, merged: 0, dropped: 0, topDropReason: undefined },
  ],
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
      'reviews: 2 counted · 1 pending origins',
      'findings: jev 1 / axis 3 / both 1',
      'added seconds per review: mean 4.3 · max 6.0',
      'input tokens per review: mean 1333',
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

describe('renderReportJson', () => {
  it('is the report itself, pretty-printed', () => {
    expect(JSON.parse(renderReportJson(REPORT))).toEqual(REPORT);
  });
});
