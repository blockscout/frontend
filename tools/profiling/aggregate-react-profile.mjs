#!/usr/bin/env node
// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console -- CLI tool, console output is the interface */

// Aggregates a React DevTools Profiler export ("Save profile..." JSON) into a per-component
// cost table: total self-render time, instance count, and average per instance.
//
// Usage:
//   node tools/profiling/aggregate-react-profile.mjs <profile.json> [options]
//   node tools/profiling/aggregate-react-profile.mjs <a.json> <b.json> [options]   # compare mode
//
// Options:
//   --commit=N     commit index to analyze in the first file (default: the longest commit)
//   --commit-b=N   commit index in the second file (default: the longest commit)
//   --top=N        number of rows to print (default: 40)
//   --min-ms=N     only list commits >= N ms in the overview (default: 15)
//
// Compare mode prints each file's table plus a delta table (matched by component name).
// Only compare traces from the same build flavor: minified names differ across builds.
//
// See tools/profiling/CONTEXT.md for the full workflow.

import fs from 'node:fs';

const TYPE_NAMES = {
  '1': 'Class', '2': 'Context', '3': 'Function', '4': 'ForwardRef', '5': 'Function',
  '6': 'ForwardRef', '7': 'HostComponent', '8': 'Memo', '9': 'OtherOrUnknown',
  '10': 'Profiler', '11': 'Root', '12': 'Suspense', '13': 'SuspenseList', '14': 'TracingMarker',
};
const ELEMENT_TYPE_ROOT = 11;

function utfDecode(arr, start, length) {
  let s = '';
  for (let k = 0; k < length; k++) {
    s += String.fromCodePoint(arr[start + k]);
  }
  return s;
}

// Replays one entry of the DevTools "operations" wire format
// (react-devtools-shared store operations; ADD records carry a trailing
// compiledWithForget flag in recent DevTools versions).
function replayOperations(operations, names) {
  let i = 2; // [0]=rendererID, [1]=rootID
  const stringTable = [ null ];
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
      case 1: { // ADD
        const id = operations[i + 1];
        const type = operations[i + 2];
        i += 3;
        if (type === ELEMENT_TYPE_ROOT) {
          i += 4; // isStrictModeCompliant, profilingFlags, supportsStrictMode, hasOwnerMetadata
          names.set(id, { name: '(root)', type });
        } else {
          // parentID, ownerID, displayNameStringID, keyStringID, compiledWithForget
          const displayNameStringID = operations[i + 2];
          i += 5;
          if (displayNameStringID >= stringTable.length) {
            throw new Error(`string id out of range: ${ displayNameStringID }`);
          }
          names.set(id, { name: stringTable[displayNameStringID] ?? 'Anonymous', type });
        }
        break;
      }
      case 2: // REMOVE: count, ...ids
        i += 2 + operations[i + 1];
        break;
      case 3: // REORDER_CHILDREN: id, numChildren, ...children
        i += 3 + operations[i + 2];
        break;
      case 4: // UPDATE_TREE_BASE_DURATION: id, duration
        i += 3;
        break;
      case 5: // UPDATE_ERRORS_OR_WARNINGS: id, errors, warnings
        i += 4;
        break;
      case 6: // REMOVE_ROOT
        i += 1;
        break;
      case 7: // SET_SUBTREE_MODE: rootID, mode
        i += 3;
        break;
      default:
        throw new Error(`unknown op ${ op } at index ${ i }`);
    }
  }
}

function loadProfile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const root = data.dataForRoots[0];

  // fiberID -> { name, type }; operations cover everything mounted while profiling,
  // snapshots fill in fibers that existed before profiling started (and still exist at the end)
  const names = new Map();
  for (const [ index, ops ] of root.operations.entries()) {
    try {
      replayOperations(ops, names);
    } catch (error) {
      console.warn(`(warning: failed to parse operations[${ index }] of ${ file }: ${ error.message } — attribution may be partial)`);
    }
  }
  for (const [ id, node ] of root.snapshots) {
    if (!names.has(id)) {
      const hocPrefix = node.hocDisplayNames?.length ? `${ node.hocDisplayNames.join('(') }(` : '';
      const name = hocPrefix ? `${ hocPrefix }${ node.displayName })` : (node.displayName ?? 'Anonymous');
      names.set(id, { name, type: node.type });
    }
  }

  return { root, names };
}

function biggestCommitIndex(root) {
  return root.commitData.reduce((best, c, i) => (c.duration > root.commitData[best].duration ? i : best), 0);
}

function aggregate({ root, names }, commitIndex) {
  const commit = root.commitData[commitIndex];
  const byName = new Map();
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

function printCommitList(root, minMs) {
  root.commitData.forEach((c, i) => {
    if (c.duration >= minMs) {
      console.log(`  commit ${ i }: ${ c.duration.toFixed(1) }ms, ${ c.fiberSelfDurations.length } fibers, at ${ (c.timestamp / 1000).toFixed(1) }s`);
    }
  });
}

function printTable(file, result, top) {
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

function printDelta(resultA, resultB, top) {
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

// --- CLI ---

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
const getOption = (name, fallback) => {
  const raw = args.find((a) => a.startsWith(`--${ name }=`));
  return raw ? Number(raw.split('=')[1]) : fallback;
};

if (files.length < 1 || files.length > 2) {
  console.error('Usage: node tools/profiling/aggregate-react-profile.mjs <profile.json> [profileB.json] [--commit=N] [--commit-b=N] [--top=N] [--min-ms=N]');
  process.exit(1);
}

const top = getOption('top', 40);
const minMs = getOption('min-ms', 15);

const profileA = loadProfile(files[0]);
console.log(`Commits >= ${ minMs }ms in ${ files[0] }:`);
printCommitList(profileA.root, minMs);
const resultA = aggregate(profileA, getOption('commit', biggestCommitIndex(profileA.root)));
printTable(files[0], resultA, top);

if (files[1]) {
  const profileB = loadProfile(files[1]);
  console.log(`\nCommits >= ${ minMs }ms in ${ files[1] }:`);
  printCommitList(profileB.root, minMs);
  const resultB = aggregate(profileB, getOption('commit-b', biggestCommitIndex(profileB.root)));
  printTable(files[1], resultB, top);
  printDelta(resultA, resultB, top);
}
