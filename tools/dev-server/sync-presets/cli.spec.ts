import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { CliPaths } from './cli';
import { DRIFT_MESSAGE, runSync } from './cli';
import { TARGETS, buildBlock } from './sync';

const [ WORKFLOW_TARGET, TASKS_TARGET ] = TARGETS;

const REGISTRY = '{"eth":"https://eth.example","gnosis":"https://gnosis.example"}';
const ALIASES = [ 'eth', 'gnosis' ];

let paths: CliPaths;

function writeTarget(file: string, blockLines: ReadonlyArray<string>): void {
  const absPath = path.join(paths.root, file);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, [ 'before', ...blockLines, 'after', '' ].join('\n'));
}

function readTarget(file: string): string {
  return fs.readFileSync(path.join(paths.root, file), 'utf8');
}

function inSyncBlock(target: typeof WORKFLOW_TARGET): Array<string> {
  return buildBlock(target, ALIASES).split('\n');
}

function driftedBlock(target: typeof WORKFLOW_TARGET): Array<string> {
  return buildBlock(target, [ 'eth' ]).split('\n');
}

function writeBothTargets(blockOf: (target: typeof WORKFLOW_TARGET) => Array<string>): void {
  writeTarget(WORKFLOW_TARGET.file, blockOf(WORKFLOW_TARGET));
  writeTarget(TASKS_TARGET.file, blockOf(TASKS_TARGET));
}

beforeEach(() => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-presets-'));
  paths = { root, registryPath: path.join(root, 'registry.json') };
  fs.writeFileSync(paths.registryPath, REGISTRY);
});

afterEach(() => {
  fs.rmSync(paths.root, { recursive: true, force: true });
});

describe('check mode', () => {
  it('exits 0 and prints a tick per target when both are in sync', () => {
    writeBothTargets(inSyncBlock);

    const result = runSync(paths, false);

    expect(result.exitCode).toBe(0);
    expect(result.output).toEqual([
      { stream: 'out', text: `✓ ${ WORKFLOW_TARGET.file }` },
      { stream: 'out', text: `✓ ${ TASKS_TARGET.file }` },
    ]);
  });

  it('exits 1, names the drifted file on stderr and appends the hint', () => {
    writeTarget(WORKFLOW_TARGET.file, driftedBlock(WORKFLOW_TARGET));
    writeTarget(TASKS_TARGET.file, inSyncBlock(TASKS_TARGET));

    const result = runSync(paths, false);

    expect(result.exitCode).toBe(1);
    expect(result.output).toEqual([
      { stream: 'err', text: `✗ out of sync: ${ WORKFLOW_TARGET.file }` },
      { stream: 'out', text: `✓ ${ TASKS_TARGET.file }` },
      { stream: 'err', text: DRIFT_MESSAGE },
    ]);
  });

  it('leaves a drifted file untouched', () => {
    writeBothTargets(driftedBlock);
    const before = readTarget(WORKFLOW_TARGET.file);

    runSync(paths, false);

    expect(readTarget(WORKFLOW_TARGET.file)).toBe(before);
  });
});

describe('write mode', () => {
  it('exits 0 and reports "ok" per target when nothing needs rewriting', () => {
    writeBothTargets(inSyncBlock);

    const result = runSync(paths, true);

    expect(result.exitCode).toBe(0);
    expect(result.output).toEqual([
      { stream: 'out', text: `✓ ok       ${ WORKFLOW_TARGET.file }` },
      { stream: 'out', text: `✓ ok       ${ TASKS_TARGET.file }` },
    ]);
  });

  it('rewrites a drifted file, reports "updated" and still exits 0', () => {
    writeBothTargets(driftedBlock);

    const result = runSync(paths, true);

    expect(result.exitCode).toBe(0);
    expect(result.output).toEqual([
      { stream: 'out', text: `✏️  updated  ${ WORKFLOW_TARGET.file }` },
      { stream: 'out', text: `✏️  updated  ${ TASKS_TARGET.file }` },
    ]);
    expect(readTarget(WORKFLOW_TARGET.file)).toContain('            - gnosis');
    expect(readTarget(TASKS_TARGET.file)).toContain('              "gnosis",');
  });

  it('preserves the lines around the block', () => {
    writeBothTargets(driftedBlock);

    runSync(paths, true);

    const lines = readTarget(WORKFLOW_TARGET.file).split('\n');
    expect(lines[0]).toBe('before');
    expect(lines.at(-2)).toBe('after');
  });

  it('leaves the tree in a state a following check passes', () => {
    writeBothTargets(driftedBlock);

    runSync(paths, true);

    expect(runSync(paths, false).exitCode).toBe(0);
  });
});

describe('malformed markers', () => {
  it('throws naming the target file rather than reporting drift', () => {
    writeTarget(WORKFLOW_TARGET.file, [ '            # presets:end' ]);
    writeTarget(TASKS_TARGET.file, inSyncBlock(TASKS_TARGET));

    expect(() => runSync(paths, false))
      .toThrow(`Missing or malformed presets:start/presets:end markers in ${ WORKFLOW_TARGET.file }`);
  });
});
