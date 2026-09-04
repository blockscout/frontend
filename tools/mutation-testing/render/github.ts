// GitHub Actions output path: one inline `::error` annotation per surviving line, so a weak
// assertion shows up on the diff during review instead of at the bottom of a job log. Pure
// formatters here; the stdout writes live in index.ts, guarded by $GITHUB_ACTIONS.

import type { Findings, LineFinding } from '../stryker/report';
import { formatMutators } from './findings';

// Annotation directives are single-line; a newline would truncate the message and leave the rest
// of it on stdout as stray output.
function sanitize(message: string): string {
  return message.replace(/[\r\n]+/g, ' ');
}

function survivorMessage(finding: LineFinding): string {
  return `Mutant survived: ${ formatMutators(finding) } — this change was made here and no test failed.`;
}

// One `::error file=<f>,line=<n>::<msg>` per surviving line, matching the terminal report's grouping:
// several mutators surviving together is one weak assertion, so it gets one annotation.
export function githubAnnotations(findings: Findings): Array<string> {
  return findings.survivors.flatMap(({ file, lines }) => lines.map((finding) =>
    `::error file=${ file },line=${ finding.line }::${ sanitize(survivorMessage(finding)) }`));
}

// A truncated run reports fewer survivors than the selection holds, so it could pass the gate on
// mutants it never tested. The notice is on stdout either way; as a `::warning` it also reaches the
// job's annotation list, where a green run gets looked at.
export function truncationAnnotation(notice: string): string {
  return `::warning::${ sanitize(notice) }`;
}
