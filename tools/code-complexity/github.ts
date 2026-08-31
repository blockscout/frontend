// GitHub Actions output path (spec FR8): inline `::error` annotations on the PR diff for each
// offender, plus the full report table written to the job summary. Pure formatters here; the
// side effects (stdout + $GITHUB_STEP_SUMMARY) live in index.ts, guarded by $GITHUB_ACTIONS.

import type { Contribution } from './complexity';
import { flatteningSaving, isNestingStructureReason } from './complexity';
import type { ReportRow, Thresholds } from './report';
import { isOffender, maxCognitiveFor } from './report';

// How many top increment sites to name in a cognitive-complexity annotation before the reader should
// just open the function.
const TOP_CONTRIBUTORS = 3;

// Annotation directives are single-line; a newline would truncate the message and break the rest.
function sanitize(message: string): string {
  return message.replace(/[\r\n]+/g, ' ');
}

// The heaviest increment sites, worst first, as "reason +amount (L<line>)".
function topContributors(contributions: ReadonlyArray<Contribution>): string {
  return [ ...contributions ]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_CONTRIBUTORS)
    .map((contribution) => `${ contribution.reason } +${ contribution.amount } (L${ contribution.line })`)
    .join(', ');
}

// The deepest nesting pocket and what flattening it by one level would save: every nesting structure
// sitting at the deepest level pays `1 + depth²`, so removing that level drops each of them by
// `2·depth − 1`. Flat increments (else, boolean runs) carry no nesting penalty and are not counted.
function deepestPocket(contributions: ReadonlyArray<Contribution>): string {
  const maxNesting = Math.max(0, ...contributions.map((contribution) => contribution.nesting));
  if (maxNesting === 0) return ''; // nothing nested to flatten

  const atDepth = contributions.filter((contribution) => contribution.nesting === maxNesting);
  const line = atDepth[0].line;
  const saving = atDepth.filter((contribution) => isNestingStructureReason(contribution.reason)).length *
    flatteningSaving(maxNesting);
  const savingText = saving > 0 ? `, flattening saves ~${ saving }` : '';
  return `deepest nesting ${ maxNesting } at L${ line }${ savingText }`;
}

function offenderMessage(row: ReportRow, thresholds: Thresholds): string {
  const parts: Array<string> = [];
  if (row.brokeCognitive) {
    const detail = [ `top: ${ topContributors(row.contributions) }`, deepestPocket(row.contributions) ].filter(Boolean).join('; ');
    parts.push(`cognitive ${ row.cognitive } > ${ maxCognitiveFor(row.kind, thresholds) } [${ detail }]`);
  }
  // crap is non-null whenever brokeCrap is true (the CRAP gate only trips on a scored function).
  if (row.brokeCrap) parts.push(`CRAP ${ (row.crap as number).toFixed(1) } > ${ thresholds.maxCrap }`);
  return `${ row.name }: ${ parts.join('; ') }`;
}

// One `::error file=<f>,line=<n>::<msg>` per offender — GitHub surfaces these inline on the diff.
export function githubAnnotations(rows: ReadonlyArray<ReportRow>, thresholds: Thresholds): Array<string> {
  return rows
    .filter(isOffender)
    .map((row) => `::error file=${ row.file },line=${ row.line }::${ sanitize(offenderMessage(row, thresholds)) }`);
}

// The full table, fenced so the job summary renders it monospace (its column alignment survives).
export function stepSummary(table: string): string {
  return [ '## Cognitive complexity & CRAP gate', '', '```', table, '```', '' ].join('\n');
}
