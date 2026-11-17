import { MINUTE_MS } from '../config';
import type { RunResults } from '../stryker/results';

// The line a truncated run prints alongside its totals. A run stopped at its budget covers part of
// the selection, and the numbers beside it are only that part's — so the notice says both, and the
// report is never presented as a complete one.

const PERCENT = 100;

// Two decimals so a budget set in seconds during a bisect is still reported as what was asked for,
// while the whole minutes a real run uses print bare.
const BUDGET_DECIMALS = 2;

function budgetText(budgetMs: number): string {
  return `${ Number((budgetMs / MINUTE_MS).toFixed(BUDGET_DECIMALS)) } min`;
}

// Stryker plans a run before testing anything, so a stream with no plan record was cut off during
// the dry run — the denominator is genuinely unknown rather than zero.
function shareText(tested: number, planned: number | null): string {
  if (tested === 0) return 'none of the selection';
  if (planned === null) return 'an unknown share of the selection';
  return `${ Math.round((tested / planned) * PERCENT) }% of the selection`;
}

export function formatTruncationNotice(results: Extract<RunResults, { truncated: true }>, budgetMs: number): string {
  const { tested, planned } = results;
  const total = planned === null ? '' : ` of ${ planned }`;

  return `Run TRUNCATED: the ${ budgetText(budgetMs) } budget expired after ${ tested }${ total } mutant(s) — ` +
    `${ shareText(tested, planned) } was covered. Raise the budget with --budget <minutes>.`;
}
