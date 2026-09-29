import fs from 'fs';
import path from 'path';

// The task spec's Functional Requirements, as the spec grid asks about them: one entry per item of
// the numbered list under `## Functional requirements`, id `FR<n>` from the number as written, text
// with its continuation lines joined and bold lead-ins kept as words.

export interface Requirement {
  readonly id: string;
  readonly text: string;
}

export type SpecSource =
  { readonly status: 'ok'; readonly path: string; readonly requirements: ReadonlyArray<Requirement> } |
  { readonly status: 'no-spec' } |
  { readonly status: 'failed'; readonly reason: string };

const SECTION_HEADING = /^## +functional requirements *$/i;
const ANY_HEADING = /^#{1,6}\s/;
const LIST_ITEM = /^(\d+)\. +(\S.*)$/;
const CONTINUATION = /^ +(\S.*)$/;
const BOLD = /\*\*/g;

function sectionLines(specText: string): Array<string> {
  const lines = specText.split('\n');
  const start = lines.findIndex((line) => SECTION_HEADING.test(line));
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => ANY_HEADING.test(line));
  return end === -1 ? rest : rest.slice(0, end);
}

function normalize(parts: ReadonlyArray<string>): string {
  return parts.join(' ').replace(BOLD, '').replace(/\s+/g, ' ').trim();
}

export function parseRequirements(specText: string): Array<Requirement> {
  const requirements: Array<Requirement> = [];
  let current: { id: string; parts: Array<string> } | undefined;
  const flush = (): void => {
    if (current !== undefined) requirements.push({ id: current.id, text: normalize(current.parts) });
    current = undefined;
  };
  for (const line of sectionLines(specText)) {
    const item = LIST_ITEM.exec(line);
    if (item) {
      flush();
      current = { id: `FR${ item[1] }`, parts: [ item[2] ] };
      continue;
    }
    const continuation = CONTINUATION.exec(line);
    if (continuation && current !== undefined) current.parts.push(continuation[1]);
    else if (line.trim() !== '') flush();
  }
  flush();
  return requirements;
}

// An explicit `--spec` that points nowhere is the caller's mistake and is reported, not thrown: the
// review passing it still gets its standards grid.
export function readSpec(specPath: string | undefined, cwd: string): SpecSource {
  if (specPath === undefined) return { status: 'no-spec' };
  const absolute = path.resolve(cwd, specPath);
  if (!fs.existsSync(absolute)) return { status: 'failed', reason: `Spec file not found: ${ specPath }` };
  const requirements = parseRequirements(fs.readFileSync(absolute, 'utf8'));
  if (requirements.length === 0) return { status: 'failed', reason: `No "## Functional requirements" numbered list in ${ specPath }` };
  return { status: 'ok', path: specPath, requirements };
}
