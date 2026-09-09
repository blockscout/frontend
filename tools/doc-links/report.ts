// Formats the findings. Kept free of `console` so a spec can assert the exact lines and exit code.

import type { Finding } from './check';
import { ILLUSTRATION_FORMS } from './strip';

export interface OutputLine {
  readonly stream: 'out' | 'err';
  readonly text: string;
}

export interface Report {
  readonly output: ReadonlyArray<OutputLine>;
  readonly exitCode: number;
}

export function renderReport(findings: ReadonlyArray<Finding>, fileCount: number): Report {
  if (findings.length === 0) {
    return {
      output: [ { stream: 'out', text: `Doc links: ${ fileCount } files checked, every reference resolves.` } ],
      exitCode: 0,
    };
  }

  const output: Array<OutputLine> = findings.map(({ file, line, message }) => (
    { stream: 'err', text: `${ file }:${ line } — ${ message }` }
  ));

  output.push({
    stream: 'err',
    text: `\n${ findings.length } unresolved reference(s) across ${ fileCount } file(s).\n` +
      `A path naming a shape rather than a file has to be marked as one, or it is read as a reference: ${ ILLUSTRATION_FORMS }.`,
  });

  return { output, exitCode: 1 };
}
