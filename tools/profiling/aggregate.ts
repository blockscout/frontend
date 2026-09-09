/* eslint-disable no-console -- CLI tool, console output is the interface */
import fs from 'fs';

// Aggregates a React DevTools Profiler export ("Save profile..." JSON) into a per-component cost
// table: total self-render time, instance count, and average per instance. With two profiles the
// caller also gets a delta table matched by component name.
//
// Argument parsing and the print calls live in ./index.ts, so everything here can be imported by the
// specs without executing a run.
//
// See tools/profiling/CONTEXT.md for the full workflow and the wire-format gotchas.

const TYPE_NAMES: Record<number, string | undefined> = {
  '1': 'Class', '2': 'Context', '3': 'Function', '4': 'ForwardRef', '5': 'Function',
  '6': 'ForwardRef', '7': 'HostComponent', '8': 'Memo', '9': 'OtherOrUnknown',
  '10': 'Profiler', '11': 'Root', '12': 'Suspense', '13': 'SuspenseList', '14': 'TracingMarker',
};
const ELEMENT_TYPE_ROOT = 11;

const OP_ADD = 1;
const OP_REMOVE = 2;
const OP_REORDER_CHILDREN = 3;
const OP_UPDATE_TREE_BASE_DURATION = 4;
const OP_UPDATE_ERRORS_OR_WARNINGS = 5;
const OP_REMOVE_ROOT = 6;
const OP_SET_SUBTREE_MODE = 7;

export interface SnapshotNode {
  readonly displayName: string | null;
  readonly type: number;
  readonly hocDisplayNames?: ReadonlyArray<string> | null;
}

export interface CommitData {
  readonly duration: number;
  readonly timestamp: number;
  readonly effectDuration?: number | null;
  readonly passiveEffectDuration?: number | null;
  // [ fiberID, self render duration in ms ]
  readonly fiberSelfDurations: ReadonlyArray<readonly [ number, number ]>;
}

export interface RootData {
  // one flat op-code array per commit — see replayOperations
  readonly operations: ReadonlyArray<ReadonlyArray<number>>;
  // the final tree, serialized from a Map
  readonly snapshots: ReadonlyArray<readonly [ number, SnapshotNode ]>;
  readonly commitData: ReadonlyArray<CommitData>;
}

export interface ProfileExport {
  readonly dataForRoots: ReadonlyArray<RootData>;
}

export interface FiberInfo {
  readonly name: string;
  readonly type: number;
}

export type FiberNames = Map<number, FiberInfo>;

export interface Profile {
  readonly root: RootData;
  readonly names: FiberNames;
}

export interface ComponentRow {
  readonly name: string;
  readonly total: number;
  readonly count: number;
  readonly avg: number;
}

export interface AggregateResult {
  readonly commit: CommitData;
  readonly commitIndex: number;
  readonly rows: ReadonlyArray<ComponentRow>;
  readonly totalSelf: number;
  readonly unknownCount: number;
  readonly unknownTime: number;
}

function utfDecode(arr: ReadonlyArray<number>, start: number, length: number): string {
  let s = '';
  for (let k = 0; k < length; k++) {
    s += String.fromCodePoint(arr[start + k]);
  }
  return s;
}

// ADD: id, type, then either the four root-only fields (isStrictModeCompliant, profilingFlags,
// supportsStrictMode, hasOwnerMetadata) or parentID, ownerID, displayNameStringID, keyStringID and
// the trailing compiledWithForget flag recent DevTools versions carry. Returns the next index.
function replayAdd(
  operations: ReadonlyArray<number>,
  i: number,
  stringTable: ReadonlyArray<string | null>,
  names: FiberNames,
): number {
  const id = operations[i + 1];
  const type = operations[i + 2];

  if (type === ELEMENT_TYPE_ROOT) {
    names.set(id, { name: '(root)', type });
    return i + 7;
  }

  const displayNameStringID = operations[i + 5];
  if (displayNameStringID >= stringTable.length) {
    throw new Error(`string id out of range: ${ displayNameStringID }`);
  }
  names.set(id, { name: stringTable[displayNameStringID] ?? 'Anonymous', type });
  return i + 8;
}

// Replays one entry of the DevTools "operations" wire format
// (react-devtools-shared store operations).
export function replayOperations(operations: ReadonlyArray<number>, names: FiberNames): void {
  let i = 2; // [0]=rendererID, [1]=rootID
  const stringTable: Array<string | null> = [ null ];
  const stringTableSize = operations[i++];
  const stringTableEnd = i + stringTableSize;
  while (i < stringTableEnd) {
    const len = operations[i++];
    stringTable.push(utfDecode(operations, i, len));
    i += len;
  }

  while (i < operations.length) {
    const op = operations[i];
    switch (op) {
      case OP_ADD:
        i = replayAdd(operations, i, stringTable, names);
        break;
      case OP_REMOVE: // operands: count, ...ids
        i += 2 + operations[i + 1];
        break;
      case OP_REORDER_CHILDREN: // operands: id, numChildren, ...children
        i += 3 + operations[i + 2];
        break;
      case OP_UPDATE_TREE_BASE_DURATION: // operands: id, duration
        i += 3;
        break;
      case OP_UPDATE_ERRORS_OR_WARNINGS: // operands: id, errors, warnings
        i += 4;
        break;
      case OP_REMOVE_ROOT:
        i += 1;
        break;
      case OP_SET_SUBTREE_MODE: // operands: rootID, mode
        i += 3;
        break;
      default:
        throw new Error(`unknown op ${ op } at index ${ i }`);
    }
  }
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function snapshotName(node: SnapshotNode): string {
  const hocPrefix = node.hocDisplayNames?.length ? `${ node.hocDisplayNames.join('(') }(` : '';
  return hocPrefix ? `${ hocPrefix }${ node.displayName })` : (node.displayName ?? 'Anonymous');
}

export function loadProfile(file: string): Profile {
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as ProfileExport;
  const root = data.dataForRoots[0];

  // fiberID -> { name, type }; operations cover everything mounted while profiling,
  // snapshots fill in fibers that existed before profiling started (and still exist at the end)
  const names: FiberNames = new Map();
  for (const [ index, ops ] of root.operations.entries()) {
    try {
      replayOperations(ops, names);
    } catch (error) {
      console.warn(`(warning: failed to parse operations[${ index }] of ${ file }: ${ messageOf(error) } — attribution may be partial)`);
    }
  }
  for (const [ id, node ] of root.snapshots) {
    if (!names.has(id)) {
      names.set(id, { name: snapshotName(node), type: node.type });
    }
  }

  return { root, names };
}

export function biggestCommitIndex(root: RootData): number {
  return root.commitData.reduce((best, c, i) => (c.duration > root.commitData[best].duration ? i : best), 0);
}

export function aggregate({ root, names }: Profile, commitIndex: number): AggregateResult {
  const commit = root.commitData[commitIndex];
  const byName = new Map<string, { total: number; count: number }>();
  let unknownCount = 0;
  let unknownTime = 0;
  let totalSelf = 0;

  for (const [ fiberId, selfMs ] of commit.fiberSelfDurations) {
    totalSelf += selfMs;
    const info = names.get(fiberId);
    if (!info) {
      unknownCount++;
      unknownTime += selfMs;
      continue;
    }
    const label = `${ info.name } (${ TYPE_NAMES[info.type] ?? info.type })`;
    const entry = byName.get(label) || { total: 0, count: 0 };
    entry.total += selfMs;
    entry.count += 1;
    byName.set(label, entry);
  }

  const rows = [ ...byName.entries() ]
    .map(([ name, e ]) => ({ name, ...e, avg: e.total / e.count }))
    .sort((a, b) => b.total - a.total);

  return { commit, commitIndex, rows, totalSelf, unknownCount, unknownTime };
}

export function printCommitList(root: RootData, minMs: number): void {
  root.commitData.forEach((c, i) => {
    if (c.duration >= minMs) {
      console.log(`  commit ${ i }: ${ c.duration.toFixed(1) }ms, ${ c.fiberSelfDurations.length } fibers, at ${ (c.timestamp / 1000).toFixed(1) }s`);
    }
  });
}

export function printTable(file: string, result: AggregateResult, top: number): void {
  const { commit, commitIndex, rows, totalSelf, unknownCount, unknownTime } = result;
  console.log(`\n=== ${ file } — commit #${ commitIndex }: duration=${ commit.duration.toFixed(1) }ms, ` +
    `fibers=${ commit.fiberSelfDurations.length }, sum(self)=${ totalSelf.toFixed(1) }ms, ` +
    `effects=${ commit.effectDuration?.toFixed(1) }ms, passive=${ commit.passiveEffectDuration?.toFixed(1) }ms ===`);
  if (unknownCount) {
    console.log(`(unattributed: ${ unknownCount } fibers, ${ unknownTime.toFixed(1) }ms)`);
  }
  console.log('rank | component | total ms | % of self | instances | avg ms');
  rows.slice(0, top).forEach((r, i) => {
    console.log(
      String(i + 1).padStart(4) + ' | ' +
      r.name.padEnd(44) + ' | ' +
      r.total.toFixed(1).padStart(8) + ' | ' +
      ((r.total / totalSelf) * 100).toFixed(1).padStart(6) + '% | ' +
      String(r.count).padStart(6) + ' | ' +
      r.avg.toFixed(3).padStart(7),
    );
  });
  const shown = rows.slice(0, top).reduce((s, r) => s + r.total, 0);
  console.log(`top-${ top } account for ${ shown.toFixed(1) }ms of ${ totalSelf.toFixed(1) }ms self time; ${ rows.length } component types`);
}

export function printDelta(resultA: AggregateResult, resultB: AggregateResult, top: number): void {
  const allNames = new Set([ ...resultA.rows.map((r) => r.name), ...resultB.rows.map((r) => r.name) ]);
  const mapA = new Map(resultA.rows.map((r) => [ r.name, r ]));
  const mapB = new Map(resultB.rows.map((r) => [ r.name, r ]));

  const deltas = [ ...allNames ]
    .map((name) => {
      const a = mapA.get(name) ?? { total: 0, count: 0 };
      const b = mapB.get(name) ?? { total: 0, count: 0 };
      return { name, a, b, delta: b.total - a.total };
    })
    .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));

  console.log(`\n=== Delta (B − A): ${ (resultB.totalSelf - resultA.totalSelf).toFixed(1) }ms total self time ===`);
  console.log('component | A ms (inst) | B ms (inst) | delta ms');
  deltas.slice(0, top).forEach((d) => {
    console.log(
      d.name.padEnd(44) + ' | ' +
      `${ d.a.total.toFixed(1) } (${ d.a.count })`.padStart(14) + ' | ' +
      `${ d.b.total.toFixed(1) } (${ d.b.count })`.padStart(14) + ' | ' +
      (d.delta >= 0 ? '+' : '') + d.delta.toFixed(1),
    );
  });
}
