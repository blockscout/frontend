// GitHub Actions output path (spec FR8): inline `::error` annotations on the PR diff for each
// offender, plus the full report table written to the job summary. Pure formatters here; the
// side effects (stdout + $GITHUB_STEP_SUMMARY) live in index.ts, guarded by $GITHUB_ACTIONS.

import type { ReportRow, Thresholds } from './report';
import { isOffender } from './report';

// Annotation directives are single-line; a newline would truncate the message and break the rest.
function sanitize(message: string): string {
  return message.replace(/[\r\n]+/g, ' ');
}

function offenderMessage(row: ReportRow, thresholds: Thresholds): string {
  const parts: Array<string> = [];
  if (row.brokeComplexity) parts.push(`complexity ${ row.complexity } > ${ thresholds.maxComplexity }`);
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
  return [ '## Cyclomatic complexity & CRAP gate', '', '```', table, '```', '' ].join('\n');
}
