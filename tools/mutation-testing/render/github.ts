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

export function truncationAnnotation(notice: string): string {
  return `::warning::${ sanitize(notice) }`;
}

// A fence because markdown renders its contents verbatim, which the score table's column alignment
// needs; as prose the table would collapse into one run of words.
const CODE_FENCE = '```';

// The step summary renders on the run page itself, which is where a passing run gets read — its
// table would otherwise only exist inside a job log, below checkout and install output.
export function stepSummary(report: string): string {
  return `## Mutation testing\n\n${ CODE_FENCE }\n${ report }\n${ CODE_FENCE }\n`;
}
