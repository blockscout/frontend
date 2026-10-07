import { isEqual } from 'es-toolkit';

import { describeWhy } from './recognize';
import type { Correction, NodeRecord, SidecarRecord } from './sidecar';
import { describeLeaf } from './values';

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

function changeOf(previous: NodeRecord, next: NodeRecord): NodeChange {
  const values = !isEqual(previous.values, next.values);
  const decision = !isEqual(decisionOf(previous), decisionOf(next));
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
// correction is kept but marked stale, for the developer to re-confirm with a new `--correct`.
function carriedCorrection(old: NodeRecord, next: NodeRecord): Correction | null {
  if (old.correction === null) return null;
  const change = changeOf(old, next);
  const valuesChanged = change.kind === 'changed' && change.values;
  return valuesChanged ? { ...old.correction, stale: true } : old.correction;
}

export function carryCorrections(previous: SidecarRecord, next: SidecarRecord): SidecarRecord {
  const before = new Map(previous.nodes.map((node) => [ node.id, node ]));
  return {
    ...next,
    nodes: next.nodes.map((node) => {
      const old = before.get(node.id);
      return { ...node, correction: old === undefined ? null : carriedCorrection(old, node) };
    }),
  };
}

export function describeCorrection(correction: Correction): string {
  const props = correction.props.length === 0 ? '' : ` ${ correction.props.join(' ') }`;
  return `${ correction.component }${ props } (${ correction.gap }${ correction.stale ? ', STALE' : '' })`;
}

function describeRecord(node: NodeRecord): string {
  return `${ describeLeaf(node) } — ${ describeWhy(node, node) }`;
}

function describeChanged(change: Extract<NodeChange, { kind: 'changed' }>): Array<string> {
  const what = [ change.values ? 'values' : undefined, change.decision ? 'decision' : undefined ].filter((part) => part !== undefined).join(' and ');
  const previous = change.previous.correction;
  const correction = previous === null ?
    '' :
    `; correction ${ describeCorrection(previous) } ${ change.values ? 'is now STALE, re-confirm it' : 'kept' }`;
  return [
    `  ~ ${ change.next.id } changed ${ what }${ correction }`,
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
      const correction = change.node.correction === null ? '' : `; its correction ${ describeCorrection(change.node.correction) } is dropped`;
      return [ `  - vanished ${ change.node.id }${ correction }` ];
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
