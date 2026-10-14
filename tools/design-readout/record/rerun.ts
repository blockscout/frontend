import { isEqual } from 'es-toolkit';

import { describeLeaf } from '../extract/values';
import { describeWhy } from '../recognize/signals';
import type { Correction, NodeRecord, Override, SidecarRecord } from './sidecar';

export type NodeChange =
  { readonly kind: 'unchanged'; readonly node: NodeRecord } |
  { readonly kind: 'changed'; readonly previous: NodeRecord; readonly next: NodeRecord; readonly values: boolean; readonly decision: boolean } |
  { readonly kind: 'new'; readonly node: NodeRecord } |
  { readonly kind: 'vanished'; readonly node: NodeRecord };

type RunIdentity = Pick<SidecarRecord, 'createdAt' | 'file' | 'colorMode'>;

export interface RerunDiff {
  readonly previous: RunIdentity;
  readonly next: RunIdentity;
  readonly changes: ReadonlyArray<NodeChange>;
}

type DecisionSlice = Pick<NodeRecord, 'decision' | 'status' | 'tokens' | 'composite'>;

function decisionOf({ decision, status, tokens, composite }: NodeRecord): DecisionSlice {
  return { decision, status, tokens, composite };
}

// The previous record came back through JSON, which drops a key whose value is `undefined`
// (`trailingGlyphs`), so the fresh extraction is put through the same round trip before comparing.
function stored<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function changeOf(previous: NodeRecord, next: NodeRecord): NodeChange {
  const values = !isEqual(stored(previous.values), stored(next.values));
  const decision = !isEqual(stored(decisionOf(previous)), stored(decisionOf(next)));
  if (!values && !decision) return { kind: 'unchanged', node: next };
  return { kind: 'changed', previous, next, values, decision };
}

function identityOf({ createdAt, file, colorMode }: SidecarRecord): RunIdentity {
  return { createdAt, file, colorMode };
}

// The new record's nodes in their order, then the vanished ones in the old record's order. A box
// move alone is neither a value nor a decision change: the box is layout, which the readout leaves
// to the developer, so a nudged row prints nothing.
export function diffRecords(previous: SidecarRecord, next: SidecarRecord): RerunDiff {
  const before = new Map(previous.nodes.map((node) => [ node.id, node ]));
  const after = new Set(next.nodes.map((node) => node.id));
  const changes: Array<NodeChange> = next.nodes.map((node) => {
    const old = before.get(node.id);
    return old === undefined ? { kind: 'new', node } : changeOf(old, node);
  });
  for (const node of previous.nodes) {
    if (!after.has(node.id)) changes.push({ kind: 'vanished', node });
  }
  return { previous: identityOf(previous), next: identityOf(next), changes };
}

// A correction is the developer's word on the values they saw: it holds while the values hold, and
// a decision change alone (a new rule in the tool) does not unsettle it. Once the values differ the
// correction is kept but marked stale, for the developer to re-confirm with a new `--correct`. An
// override is carried under the same rule.
function valuesChanged(old: NodeRecord, next: NodeRecord): boolean {
  const change = changeOf(old, next);
  // Stryker disable next-line ConditionalExpression: the kind check narrows the union; an unchanged node has no values flag to read
  return change.kind === 'changed' && change.values;
}

function carriedCorrection(old: NodeRecord, next: NodeRecord): Correction | null {
  if (old.correction === null) return null;
  return valuesChanged(old, next) ? { ...old.correction, stale: true } : old.correction;
}

function carriedOverride(old: NodeRecord, next: NodeRecord): Override | null {
  if (old.override === null) return null;
  return valuesChanged(old, next) ? { ...old.override, stale: true } : old.override;
}

export function carryCorrections(previous: SidecarRecord, next: SidecarRecord): SidecarRecord {
  const before = new Map(previous.nodes.map((node) => [ node.id, node ]));
  return {
    ...next,
    nodes: next.nodes.map((node) => {
      const old = before.get(node.id);
      if (old === undefined) return { ...node, correction: null, override: null };
      return { ...node, correction: carriedCorrection(old, node), override: carriedOverride(old, node) };
    }),
  };
}

export function describeCorrection(correction: Correction): string {
  const props = correction.props.length === 0 ? '' : ` ${ correction.props.join(' ') }`;
  return `${ correction.component }${ props } (${ correction.gap }${ correction.stale ? ', STALE' : '' })`;
}

export function describeOverride(override: Override): string {
  return `${ override.props.join(' ') }${ override.stale ? ' (STALE)' : '' }`;
}

function describeRecord(node: NodeRecord): string {
  return `${ describeLeaf(node) } — ${ describeWhy(node, node) }`;
}

function describeChanged(change: Extract<NodeChange, { kind: 'changed' }>): Array<string> {
  const what = [ change.values ? 'values' : undefined, change.decision ? 'decision' : undefined ].filter((part) => part !== undefined).join(' and ');
  const fate = change.values ? 'is now STALE, re-confirm it' : 'kept';
  const { correction, override } = change.previous;
  const carried = [
    correction === null ? '' : `; correction ${ describeCorrection(correction) } ${ fate }`,
    override === null ? '' : `; override ${ describeOverride(override) } ${ fate }`,
  ].join('');
  return [
    `  ~ ${ change.next.id } changed ${ what }${ carried }`,
    `      was ${ describeRecord(change.previous) }`,
    `      now ${ describeRecord(change.next) }`,
  ];
}

function renderChange(change: NodeChange): Array<string> {
  switch (change.kind) {
    case 'unchanged':
      return [];
    case 'new':
      return [ `  + new ${ describeRecord(change.node) }` ];
    case 'vanished': {
      const { correction, override } = change.node;
      const dropped = [
        correction === null ? '' : `; its correction ${ describeCorrection(correction) } is dropped`,
        override === null ? '' : `; its override ${ describeOverride(override) } is dropped`,
      ].join('');
      return [ `  - vanished ${ change.node.id }${ dropped }` ];
    }
    case 'changed':
      return describeChanged(change);
  }
}

export function renderRerun(diff: RerunDiff): string {
  const unchanged = diff.changes.filter((change) => change.kind === 'unchanged');
  const corrected = unchanged.filter((change) => change.node.correction !== null).length;
  const changed = diff.changes.filter((change) => change.kind !== 'unchanged');
  const mode = diff.previous.colorMode === diff.next.colorMode ? diff.next.colorMode : `${ diff.previous.colorMode } → ${ diff.next.colorMode }`;
  const version = `${ diff.previous.file.version } → ${ diff.next.file.version }`;
  return [
    `Re-run against the sidecar of ${ diff.previous.createdAt }: file version ${ version }, color mode ${ mode }`,
    `Unchanged: ${ unchanged.length } (${ corrected } recognized by correction)`,
    `Changed: ${ changed.length }`,
    ...changed.flatMap(renderChange),
  ].join('\n');
}
