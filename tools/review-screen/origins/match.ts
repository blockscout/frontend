import type { SpecSuspect } from '../grid/spec';
import type { Suspect } from '../grid/standards';
import type { SidecarRecord, WindowSpan } from '../sidecar';
import type { DropEntry, FindingRow, OriginsInput, SuspectRef } from './parse';
import { formatSuspectRef, JEV_SOURCE } from './parse';

// Which side raised each published finding, and what became of each suspect the screen sent. The
// match is mechanical: same file and a line inside the suspect's window, or the same requirement id.

export type FindingOrigin = 'axis' | 'jev' | 'both';

export interface FindingOriginRecord {
  readonly id: string;
  readonly axis: string;
  readonly sources: ReadonlyArray<string>;
  readonly origin: FindingOrigin;
}

export type SuspectFate =
  { readonly fate: 'confirmed'; readonly finding: string } |
  { readonly fate: 'merged'; readonly finding: string } |
  { readonly fate: 'dropped'; readonly reason: string };

interface ScoredSuspect {
  readonly suspect: SuspectRef;
  readonly score: number;
}

interface ConfirmedSuspect extends ScoredSuspect {
  readonly fate: 'confirmed';
  readonly finding: string;
}

interface MergedSuspect extends ScoredSuspect {
  readonly fate: 'merged';
  readonly finding: string;
}

interface DroppedSuspect extends ScoredSuspect {
  readonly fate: 'dropped';
  readonly reason: string;
}

export type SuspectFateRecord = ConfirmedSuspect | MergedSuspect | DroppedSuspect;

export interface OriginsRecord {
  readonly recordedAt: string;
  readonly findings: ReadonlyArray<FindingOriginRecord>;
  readonly suspects: ReadonlyArray<SuspectFateRecord>;
}

export const NOT_REPORTED = 'not reported';

export function originOf(sources: ReadonlyArray<string>): FindingOrigin {
  const hasJev = sources.includes(JEV_SOURCE);
  if (!hasJev) return 'axis';
  return sources.every((source) => source === JEV_SOURCE) ? 'jev' : 'both';
}

function spanOf(suspect: Suspect, spans: ReadonlyArray<WindowSpan>): { readonly firstLine: number; readonly lastLine: number } {
  const span = spans.find((candidate) => candidate.file === suspect.file && candidate.window === suspect.window);
  return span ?? { firstLine: suspect.line, lastLine: suspect.line };
}

export function findingMatchesStandards(finding: FindingRow, suspect: Suspect, spans: ReadonlyArray<WindowSpan>): boolean {
  if (finding.location.kind !== 'line' || finding.location.file !== suspect.file) return false;
  const { firstLine, lastLine } = spanOf(suspect, spans);
  return finding.location.line >= firstLine && finding.location.line <= lastLine;
}

export function findingMatchesSpec(finding: FindingRow, suspect: SpecSuspect): boolean {
  return finding.location.kind === 'requirement' && finding.location.requirement === suspect.requirement;
}

function sameSuspect(ref: SuspectRef, suspect: SuspectRef): boolean {
  return formatSuspectRef(ref) === formatSuspectRef(suspect);
}

function fateOf(
  ref: SuspectRef,
  matches: (finding: FindingRow) => boolean,
  input: OriginsInput,
): SuspectFate {
  const drop = input.drops.find((entry: DropEntry) => sameSuspect(entry.suspect, ref));
  if (drop !== undefined) return { fate: 'dropped', reason: drop.reason };
  const finding = input.findings.find((candidate) => candidate.sources.includes(JEV_SOURCE) && matches(candidate));
  if (finding === undefined) return { fate: 'dropped', reason: NOT_REPORTED };
  return originOf(finding.sources) === 'both' ? { fate: 'merged', finding: finding.id } : { fate: 'confirmed', finding: finding.id };
}

function specSuspects(record: SidecarRecord): ReadonlyArray<SpecSuspect> {
  return record.spec.status === 'ok' ? record.spec.suspects : [];
}

function withFate(scored: ScoredSuspect, fate: SuspectFate): SuspectFateRecord {
  switch (fate.fate) {
    case 'confirmed':
      return { ...scored, fate: 'confirmed', finding: fate.finding };
    case 'merged':
      return { ...scored, fate: 'merged', finding: fate.finding };
    case 'dropped':
      return { ...scored, fate: 'dropped', reason: fate.reason };
  }
}

export function assignOrigins(record: SidecarRecord, input: OriginsInput, recordedAt: string): OriginsRecord {
  const standards = record.standards.suspects.map((suspect) => {
    const ref: SuspectRef = { kind: 'standards', rule: suspect.rule, file: suspect.file, line: suspect.line };
    return withFate({ suspect: ref, score: suspect.score }, fateOf(ref, (finding) => findingMatchesStandards(finding, suspect, record.windows), input));
  });
  const spec = specSuspects(record).map((suspect) => {
    const ref: SuspectRef = { kind: 'spec', requirement: suspect.requirement };
    return withFate({ suspect: ref, score: suspect.score }, fateOf(ref, (finding) => findingMatchesSpec(finding, suspect), input));
  });
  return {
    recordedAt,
    findings: input.findings.map((finding) => ({ id: finding.id, axis: finding.axis, sources: finding.sources, origin: originOf(finding.sources) })),
    suspects: [ ...standards, ...spec ],
  };
}
