import { describe, expect, it } from 'vitest';

import { MINUTE_MS } from '../config';
import { formatTruncationNotice } from './truncation';

const BUDGET_MS = 15 * MINUTE_MS;

function notice(tested: number, planned: number | null, budgetMs = BUDGET_MS): string {
  return formatTruncationNotice({ truncated: true, report: { files: {} }, tested, planned }, budgetMs);
}

describe('formatTruncationNotice', () => {
  it('says the run was truncated, at what budget, and what share it covered', () => {
    expect(notice(42, 137)).toBe(
      'Run TRUNCATED: the 15 min budget expired after 42 of 137 mutant(s) — 31% of the selection was covered. ' +
      'Raise the budget with --budget <minutes>.',
    );
  });

  it('reports a sub-minute budget without rounding it away to zero', () => {
    expect(notice(1, 2, MINUTE_MS / 2)).toContain('the 0.5 min budget');
  });

  it('states plainly that nothing was covered when no mutant was tested', () => {
    expect(notice(0, 137)).toContain('after 0 of 137 mutant(s) — none of the selection was covered');
  });

  it('does not invent a share when the planned total never arrived', () => {
    expect(notice(3, null)).toContain('after 3 mutant(s) — an unknown share of the selection was covered');
  });
});
