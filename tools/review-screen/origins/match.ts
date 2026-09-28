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

// How far a finding sits from the suspect, or `undefined` when it does not match at all. Two suspects
// in one window (two rules, one file) each get their own finding: the nearest unclaimed one wins.
export type Distance = (finding: FindingRow) => number | undefined;

export function standardsDistance(finding: FindingRow, suspect: Suspect, spans: ReadonlyArray<WindowSpan>): number | undefined {
  if (finding.location.kind !== 'line' || finding.location.file !== suspect.file) return undefined;
  const { firstLine, lastLine } = spanOf(suspect, spans);
  const inside = finding.location.line >= firstLine && finding.location.line <= lastLine;
  return inside ? Math.abs(finding.location.line - suspect.line) : undefined;
}

export function specDistance(finding: FindingRow, suspect: SpecSuspect): number | undefined {
  return finding.location.kind === 'requirement' && finding.location.requirement === suspect.requirement ? 0 : undefined;
}

function sameSuspect(ref: SuspectRef, suspect: SuspectRef): boolean {
  return formatSuspectRef(ref) === formatSuspectRef(suspect);
}

function nearestUnclaimed(input: OriginsInput, distanceOf: Distance, claimed: Set<string>): FindingRow | undefined {
  let best: { readonly finding: FindingRow; readonly distance: number } | undefined;
  for (const candidate of input.findings) {
    if (claimed.has(candidate.id) || !candidate.sources.includes(JEV_SOURCE)) continue;
    const distance = distanceOf(candidate);
    if (distance === undefined) continue;
    if (best === undefined || distance < best.distance) best = { finding: candidate, distance };
  }
  return best?.finding;
}

function fateOf(ref: SuspectRef, distanceOf: Distance, input: OriginsInput, claimed: Set<string>): SuspectFate {
  const drop = input.drops.find((entry: DropEntry) => sameSuspect(entry.suspect, ref));
  if (drop !== undefined) return { fate: 'dropped', reason: drop.reason };
  const finding = nearestUnclaimed(input, distanceOf, claimed);
  if (finding === undefined) return { fate: 'dropped', reason: NOT_REPORTED };
  claimed.add(finding.id);
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
  const claimed = new Set<string>();
  const standards = record.standards.suspects.map((suspect) => {
    const ref: SuspectRef = { kind: 'standards', rule: suspect.rule, file: suspect.file, line: suspect.line };
    return withFate({ suspect: ref, score: suspect.score }, fateOf(ref, (finding) => standardsDistance(finding, suspect, record.windows), input, claimed));
  });
  const spec = specSuspects(record).map((suspect) => {
    const ref: SuspectRef = { kind: 'spec', requirement: suspect.requirement };
    return withFate({ suspect: ref, score: suspect.score }, fateOf(ref, (finding) => specDistance(finding, suspect), input, claimed));
  });
  return {
    recordedAt,
    findings: input.findings.map((finding) => ({ id: finding.id, axis: finding.axis, sources: finding.sources, origin: originOf(finding.sources) })),
    suspects: [ ...standards, ...spec ],
  };
}
