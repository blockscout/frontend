import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, it, expect, vi, afterEach } from 'vitest';

import type { AggregateResult, CommitData, FiberNames, ProfileExport, RootData, SnapshotNode } from './aggregate';
import {
  replayOperations,
  loadProfile,
  biggestCommitIndex,
  aggregate,
  printCommitList,
  printTable,
  printDelta,
} from './aggregate';

// --- Hand-built wire-format fixtures ------------------------------------------------------------
//
// Deliberately not a real DevTools export: an export pins the fixture to one DevTools version, and
// the wire format is exactly what is under test. The record layouts below mirror
// react-devtools-shared's store operations — keep them in step with the parser's comments.

const RENDERER_ID = 1;
const ROOT_ID = 1;
const ELEMENT_TYPE_ROOT = 11;
const ELEMENT_TYPE_FUNCTION = 5;
const ELEMENT_TYPE_MEMO = 8;

function encodeString(value: string): Array<number> {
  const points = [ ...value ].map((char) => char.codePointAt(0) ?? 0);
  return [ points.length, ...points ];
}

// The string table is length-prefixed with the number of ints it occupies, not the number of strings.
function stringTable(strings: ReadonlyArray<string>): Array<number> {
  const encoded = strings.flatMap(encodeString);
  return [ encoded.length, ...encoded ];
}

function addRoot(id: number): Array<number> {
  return [ 1, id, ELEMENT_TYPE_ROOT, 1, 0, 1, 0 ];
}

function addElement(id: number, type: number, displayNameStringID: number): Array<number> {
  return [ 1, id, type, ROOT_ID, 0, displayNameStringID, 0, 0 ];
}

const removeRecord = (...ids: Array<number>): Array<number> => [ 2, ids.length, ...ids ];
const reorderChildren = (id: number, ...children: Array<number>): Array<number> => [ 3, id, children.length, ...children ];
const updateTreeBaseDuration = (id: number, duration: number): Array<number> => [ 4, id, duration ];
const updateErrorsOrWarnings = (id: number, errors: number, warnings: number): Array<number> => [ 5, id, errors, warnings ];
const removeRootRecord = (): Array<number> => [ 6 ];
const setSubtreeMode = (mode: number): Array<number> => [ 7, ROOT_ID, mode ];

function operations(strings: ReadonlyArray<string>, ...records: Array<Array<number>>): Array<number> {
  return [ RENDERER_ID, ROOT_ID, ...stringTable(strings), ...records.flat() ];
}

function snapshot(id: number, node: Partial<SnapshotNode>): readonly [ number, SnapshotNode ] {
  return [ id, { displayName: null, type: ELEMENT_TYPE_FUNCTION, ...node } ];
}

function commitOf(
  duration: number,
  fiberSelfDurations: ReadonlyArray<readonly [ number, number ]>,
  extra: Partial<CommitData> = {},
): CommitData {
  return { duration, timestamp: 0, effectDuration: 0, passiveEffectDuration: 0, fiberSelfDurations, ...extra };
}

function rootOf(root: Partial<RootData>): RootData {
  return { operations: [], snapshots: [], commitData: [], ...root };
}

function withProfileFile(profile: ProfileExport, run: (file: string) => void): void {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-analyze-spec-'));
  const file = path.join(directory, 'profile.json');
  try {
    fs.writeFileSync(file, JSON.stringify(profile));
    run(file);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function capturedLines(spy: { mock: { calls: Array<Array<unknown>> } }): Array<string> {
  return spy.mock.calls.map((call) => String(call[0]));
}

// Splits a padded table row into its trimmed cells, so an assertion states the column contents
// without restating every pad width.
function cells(line: string): Array<string> {
  return line.split('|').map((cell) => cell.trim());
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('replayOperations', () => {
  it('decodes the string table and names an element by its display-name string id', () => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'AddressTable', 'Row' ], addElement(4, ELEMENT_TYPE_FUNCTION, 2)), names);
    expect(names.get(4)).toEqual({ name: 'Row', type: ELEMENT_TYPE_FUNCTION });
  });

  it('decodes multi-byte code points in the string table', () => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'Σum' ], addElement(4, ELEMENT_TYPE_FUNCTION, 1)), names);
    expect(names.get(4)?.name).toBe('Σum');
  });

  it('names a root record "(root)" and consumes its four extra fields', () => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'Row' ], addRoot(ROOT_ID), addElement(4, ELEMENT_TYPE_MEMO, 1)), names);
    expect(names.get(ROOT_ID)).toEqual({ name: '(root)', type: ELEMENT_TYPE_ROOT });
    expect(names.get(4)).toEqual({ name: 'Row', type: ELEMENT_TYPE_MEMO });
  });

  // String id 0 is the table's reserved null slot — an element DevTools could not name.
  it('falls back to "Anonymous" for string id 0', () => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'Row' ], addElement(4, ELEMENT_TYPE_FUNCTION, 0)), names);
    expect(names.get(4)?.name).toBe('Anonymous');
  });

  it('throws on a string id past the end of the table', () => {
    expect(() => replayOperations(operations([ 'Row' ], addElement(4, ELEMENT_TYPE_FUNCTION, 9)), new Map()))
      .toThrow('string id out of range: 9');
  });

  it('throws on an unknown op code, naming the index it stalled at', () => {
    expect(() => replayOperations(operations([ 'Row' ], [ 42, 0, 0 ]), new Map()))
      .toThrow(/unknown op 42 at index \d+/);
  });

  // Each of these records is skipped by width alone; getting the arithmetic wrong desynchronises the
  // walk, so the check is that the ADD that follows still lands.
  const SKIPPED: ReadonlyArray<readonly [ string, Array<number> ]> = [
    [ 'REMOVE', removeRecord(7, 8, 9) ],
    [ 'REORDER_CHILDREN', reorderChildren(2, 3, 4, 5) ],
    [ 'UPDATE_TREE_BASE_DURATION', updateTreeBaseDuration(2, 12) ],
    [ 'UPDATE_ERRORS_OR_WARNINGS', updateErrorsOrWarnings(2, 1, 2) ],
    [ 'REMOVE_ROOT', removeRootRecord() ],
    [ 'SET_SUBTREE_MODE', setSubtreeMode(1) ],
  ];

  it.each(SKIPPED)('advances past a %s record to the next ADD', (_label, record) => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'Row' ], record, addElement(20, ELEMENT_TYPE_FUNCTION, 1)), names);
    expect(names.get(20)).toEqual({ name: 'Row', type: ELEMENT_TYPE_FUNCTION });
  });

  it('accumulates names across entries into the same map', () => {
    const names: FiberNames = new Map();
    replayOperations(operations([ 'Row' ], addElement(4, ELEMENT_TYPE_FUNCTION, 1)), names);
    replayOperations(operations([ 'Cell' ], addElement(5, ELEMENT_TYPE_FUNCTION, 1)), names);
    expect([ ...names.keys() ]).toEqual([ 4, 5 ]);
  });
});

describe('loadProfile', () => {
  it('names fibers from the operations replay', () => {
    withProfileFile({ dataForRoots: [ rootOf({
      operations: [ operations([ 'Row' ], addRoot(ROOT_ID), addElement(4, ELEMENT_TYPE_FUNCTION, 1)) ],
    }) ] }, (file) => {
      expect(loadProfile(file).names.get(4)).toEqual({ name: 'Row', type: ELEMENT_TYPE_FUNCTION });
    });
  });

  // Fibers unmounted mid-session are only nameable through the replay, so the replay wins and
  // snapshots only fill the gaps.
  it('takes snapshots only for fibers the replay did not name', () => {
    withProfileFile({ dataForRoots: [ rootOf({
      operations: [ operations([ 'Row' ], addElement(4, ELEMENT_TYPE_FUNCTION, 1)) ],
      snapshots: [ snapshot(4, { displayName: 'Stale' }), snapshot(9, { displayName: 'Preexisting', type: ELEMENT_TYPE_MEMO }) ],
    }) ] }, (file) => {
      const { names } = loadProfile(file);
      expect(names.get(4)?.name).toBe('Row');
      expect(names.get(9)).toEqual({ name: 'Preexisting', type: ELEMENT_TYPE_MEMO });
    });
  });

  it('wraps a snapshot display name in its HOC display names', () => {
    withProfileFile({ dataForRoots: [ rootOf({
      snapshots: [ snapshot(9, { displayName: 'Table', hocDisplayNames: [ 'Memo', 'ForwardRef' ] }) ],
    }) ] }, (file) => {
      expect(loadProfile(file).names.get(9)?.name).toBe('Memo(ForwardRef(Table)');
    });
  });

  it('falls back to "Anonymous" for a snapshot with no display name and no HOCs', () => {
    withProfileFile({ dataForRoots: [ rootOf({
      snapshots: [ snapshot(9, { displayName: null, hocDisplayNames: [] }) ],
    }) ] }, (file) => {
      expect(loadProfile(file).names.get(9)?.name).toBe('Anonymous');
    });
  });

  // Format drift must degrade to partial attribution, never fail the run.
  it('warns naming the entry index and the file, and keeps the entries that parsed', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    withProfileFile({ dataForRoots: [ rootOf({
      operations: [
        operations([ 'Row' ], [ 42, 0, 0 ]),
        operations([ 'Cell' ], addElement(5, ELEMENT_TYPE_FUNCTION, 1)),
      ],
    }) ] }, (file) => {
      const { names } = loadProfile(file);
      expect(names.get(5)?.name).toBe('Cell');
      expect(warn).toHaveBeenCalledTimes(1);
      const message = String(warn.mock.calls[0][0]);
      expect(message).toContain('operations[0]');
      expect(message).toContain(file);
      expect(message).toContain('unknown op 42');
      expect(message).toContain('attribution may be partial');
    });
  });
});

describe('biggestCommitIndex', () => {
  it('picks the longest commit', () => {
    expect(biggestCommitIndex(rootOf({ commitData: [ commitOf(5, []), commitOf(31, []), commitOf(12, []) ] }))).toBe(1);
  });

  it('keeps the earlier commit when durations tie', () => {
    expect(biggestCommitIndex(rootOf({ commitData: [ commitOf(9, []), commitOf(9, []) ] }))).toBe(0);
  });
});

describe('aggregate', () => {
  const names: FiberNames = new Map([
    [ 1, { name: 'Table', type: ELEMENT_TYPE_FUNCTION } ],
    [ 2, { name: 'Row', type: ELEMENT_TYPE_MEMO } ],
    [ 3, { name: 'Row', type: ELEMENT_TYPE_MEMO } ],
    [ 4, { name: 'Odd', type: 99 } ],
  ]);

  const root = rootOf({ commitData: [
    commitOf(4, [ [ 1, 4 ] ]),
    commitOf(20, [ [ 1, 2 ], [ 2, 5 ], [ 3, 3 ], [ 4, 1 ], [ 77, 0.5 ] ]),
  ] });

  it('groups instances of one component into a single row with a total, count and average', () => {
    const { rows } = aggregate({ root, names }, 1);
    expect(rows[0]).toEqual({ name: 'Row (Memo)', total: 8, count: 2, avg: 4 });
  });

  it('sorts rows by total self time, descending', () => {
    expect(aggregate({ root, names }, 1).rows.map((r) => r.name))
      .toEqual([ 'Row (Memo)', 'Table (Function)', 'Odd (99)' ]);
  });

  it('labels an element type it has no name for with the raw type number', () => {
    expect(aggregate({ root, names }, 1).rows.map((r) => r.name)).toContain('Odd (99)');
  });

  it('accounts fibers with no name as unattributed rather than dropping their time', () => {
    const result = aggregate({ root, names }, 1);
    expect(result.unknownCount).toBe(1);
    expect(result.unknownTime).toBe(0.5);
    expect(result.totalSelf).toBe(11.5);
  });

  it('reports the commit it was pointed at', () => {
    const result = aggregate({ root, names }, 0);
    expect(result.commitIndex).toBe(0);
    expect(result.commit).toBe(root.commitData[0]);
    expect(result.rows).toEqual([ { name: 'Table (Function)', total: 4, count: 1, avg: 4 } ]);
  });
});

describe('printCommitList', () => {
  it('lists only commits at or above the minimum, with their fiber count and second offset', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printCommitList(rootOf({ commitData: [
      commitOf(4.44, [ [ 1, 1 ] ], { timestamp: 1000 }),
      commitOf(15, [ [ 1, 1 ], [ 2, 1 ] ], { timestamp: 2500 }),
      commitOf(31.25, [ [ 1, 1 ] ], { timestamp: 9000 }),
    ] }), 15);
    expect(capturedLines(log)).toEqual([
      '  commit 1: 15.0ms, 2 fibers, at 2.5s',
      '  commit 2: 31.3ms, 1 fibers, at 9.0s',
    ]);
  });
});

const PRINT_RESULT: AggregateResult = {
  commit: commitOf(12.34, [ [ 1, 8 ], [ 2, 2 ], [ 3, 0.5 ] ], { effectDuration: 1.5, passiveEffectDuration: 2.5 }),
  commitIndex: 3,
  rows: [
    { name: 'Table (Function)', total: 8, count: 2, avg: 4 },
    { name: 'Row (Memo)', total: 2, count: 4, avg: 0.5 },
  ],
  totalSelf: 10,
  unknownCount: 1,
  unknownTime: 0.5,
};

describe('printTable', () => {
  it('heads the table with the commit index, duration, fiber count and effect totals', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printTable('a.json', PRINT_RESULT, 40);
    expect(capturedLines(log)[0]).toBe(
      '\n=== a.json — commit #3: duration=12.3ms, fibers=3, sum(self)=10.0ms, effects=1.5ms, passive=2.5ms ===',
    );
  });

  it('reports the unattributed fibers under the header', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printTable('a.json', PRINT_RESULT, 40);
    expect(capturedLines(log)[1]).toBe('(unattributed: 1 fibers, 0.5ms)');
  });

  it('omits the unattributed line when everything was attributed', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printTable('a.json', { ...PRINT_RESULT, unknownCount: 0, unknownTime: 0 }, 40);
    expect(capturedLines(log)[1]).toBe('rank | component | total ms | % of self | instances | avg ms');
  });

  it('ranks each row with its share of self time, instance count and average', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printTable('a.json', PRINT_RESULT, 40);
    const lines = capturedLines(log);
    expect(cells(lines[3])).toEqual([ '1', 'Table (Function)', '8.0', '80.0%', '2', '4.000' ]);
    expect(cells(lines[4])).toEqual([ '2', 'Row (Memo)', '2.0', '20.0%', '4', '0.500' ]);
  });

  it('prints at most `top` rows and totals only those in the summary', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printTable('a.json', PRINT_RESULT, 1);
    const lines = capturedLines(log);
    expect(cells(lines[3])[1]).toBe('Table (Function)');
    expect(lines[4]).toBe('top-1 account for 8.0ms of 10.0ms self time; 2 component types');
  });
});

describe('printDelta', () => {
  const resultB: AggregateResult = {
    ...PRINT_RESULT,
    rows: [
      { name: 'Row (Memo)', total: 9, count: 4, avg: 2.25 },
      { name: 'Table (Function)', total: 7, count: 2, avg: 3.5 },
    ],
    totalSelf: 16,
  };

  it('heads the delta with the change in total self time', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printDelta(PRINT_RESULT, resultB, 40);
    expect(capturedLines(log)[0]).toBe('\n=== Delta (B − A): 6.0ms total self time ===');
  });

  it('ranks components by the size of the change, signing each delta', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printDelta(PRINT_RESULT, resultB, 40);
    const lines = capturedLines(log);
    expect(cells(lines[2])).toEqual([ 'Row (Memo)', '2.0 (4)', '9.0 (4)', '+7.0' ]);
    expect(cells(lines[3])).toEqual([ 'Table (Function)', '8.0 (2)', '7.0 (2)', '-1.0' ]);
  });

  it('scores a component present on only one side against zero', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printDelta(
      { ...PRINT_RESULT, rows: [] },
      { ...resultB, rows: [ { name: 'Row (Memo)', total: 9, count: 4, avg: 2.25 } ] },
      40,
    );
    expect(cells(capturedLines(log)[2])).toEqual([ 'Row (Memo)', '0.0 (0)', '9.0 (4)', '+9.0' ]);
  });

  it('prints at most `top` rows', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printDelta(PRINT_RESULT, resultB, 1);
    expect(capturedLines(log)).toHaveLength(3);
  });
});
