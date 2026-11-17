// Renders what a run found: the survivors, grouped by the source line they sit on, and a one-line
// count of the mutants no test covered. The two are rendered differently on purpose — a survivor is
// an assertion to strengthen and needs its line, while a no-coverage mutant is a missing test, which
// is the CRAP gate's finding and needs only its size.

import type { Findings, LineFinding } from '../stryker/report';

const NOTHING_FOUND = 'No survivors and no uncovered mutants — nothing to act on.';

const SURVIVORS_HEADING = 'SURVIVED — these changes were made and no test failed:';

// Shared with ./github.ts, so a survivor reads the same on the terminal and in the annotation
// GitHub puts on the diff line.
export function formatMutators(finding: LineFinding): string {
  return finding.mutators.map(({ name, count }) => count === 1 ? name : `${ name } ×${ count }`).join(', ');
}

function survivorLines(findings: Findings): Array<string> {
  const lines = [ SURVIVORS_HEADING ];

  for (const { file, lines: found } of findings.survivors) {
    lines.push('', file);
    // The line number is padded to the file's widest, so the mutator names line up in one column.
    const width = Math.max(...found.map((finding) => String(finding.line).length));
    for (const finding of found) lines.push(`  L${ String(finding.line).padStart(width) }  ${ formatMutators(finding) }`);
  }

  return lines;
}

function sum(findings: Findings): number {
  return findings.noCoverage.reduce((total, entry) => total + entry.mutants, 0);
}

// Deliberately one line, however many files it spans: an uncovered line is a coverage gap the CRAP
// gate already reports per function, and listing it again here would bury the survivors.
function noCoverageLine(findings: Findings): string {
  const perFile = findings.noCoverage.map(({ file, mutants }) => `${ file } (${ mutants })`).join(', ');

  return `NO COVERAGE — ${ sum(findings) } mutant(s) on ${ findings.noCoverage.length } file(s) ran no test at all, ` +
    `which the CRAP gate covers: ${ perFile }.`;
}

export function formatFindings(findings: Findings): string {
  const sections: Array<string> = [];
  if (findings.survivors.length > 0) sections.push(survivorLines(findings).join('\n'));
  if (findings.noCoverage.length > 0) sections.push(noCoverageLine(findings));

  return sections.length === 0 ? NOTHING_FOUND : sections.join('\n\n');
}
