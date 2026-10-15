import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LockDeps, RunLock } from './lock';
import { acquireLock, formatHeldMessage, formatStaleMessage, parseLock, releaseLock } from './lock';

const NOW = new Date('2026-10-15T10:00:00.000Z');
const OTHER_PID = 424242;
const OTHER_RUN: RunLock = { pid: OTHER_PID, startedAt: '2026-10-15T09:00:00.000Z', selection: 'src/b.ts' };

let tempDir: string;
let lockFile: string;
let marker: string;

function deps(alivePids: ReadonlyArray<number>): LockDeps {
  return { lockFile, isProcessAlive: (pid) => alivePids.includes(pid), now: () => NOW };
}

function writeLock(lock: RunLock): void {
  fs.writeFileSync(lockFile, JSON.stringify(lock));
}

function readLockFile(): RunLock {
  return JSON.parse(fs.readFileSync(lockFile, 'utf8')) as RunLock;
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mutation-lock-'));
  lockFile = path.join(tempDir, '.lock');
  marker = `${ lockFile }.acquiring`;
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('acquireLock', () => {
  it('creates the lock naming this process and the selection, and nothing else', () => {
    expect(acquireLock('src/a.ts', deps([]))).toEqual({ outcome: 'acquired', staleLockRemoved: undefined });
    expect(readLockFile()).toEqual({ pid: process.pid, startedAt: NOW.toISOString(), selection: 'src/a.ts' });
    expect(fs.readdirSync(tempDir)).toEqual([ '.lock' ]);
  });

  // A reader must never see the record half-written, so it is moved into place complete.
  it('writes the record in one step', () => {
    const rename = vi.spyOn(fs, 'renameSync');
    acquireLock('src/a.ts', deps([]));
    expect(rename).toHaveBeenCalledWith(expect.stringContaining(process.pid.toString()), lockFile);
  });

  // Two runs reclaiming the same dead lock must not interleave: the one that gets there second would
  // otherwise replace the record the first has just put in its place.
  it('refuses while another run is between reading the lock and writing its own', () => {
    writeLock(OTHER_RUN);
    fs.mkdirSync(marker);

    expect(() => acquireLock('src/a.ts', deps([]))).toThrow(/is taking .* this instant/);
    expect(readLockFile()).toEqual(OTHER_RUN);
    expect(fs.readdirSync(tempDir).sort()).toEqual([ '.lock', '.lock.acquiring' ]);
  });

  it('holds other runs off from the read until the record is written', () => {
    writeLock(OTHER_RUN);
    const isProcessAlive = vi.fn((): boolean => {
      expect(fs.existsSync(marker)).toBe(true);
      return false;
    });

    expect(acquireLock('src/a.ts', { ...deps([]), isProcessAlive })).toEqual({ outcome: 'acquired', staleLockRemoved: OTHER_RUN });
    expect(isProcessAlive).toHaveBeenCalledWith(OTHER_PID);
    expect(fs.existsSync(marker)).toBe(false);
  });

  it('lets other runs in again after refusing', () => {
    writeLock(OTHER_RUN);
    acquireLock('src/a.ts', deps([ OTHER_PID ]));
    expect(fs.readdirSync(tempDir)).toEqual([ '.lock' ]);
  });

  it('refuses while a live run holds the lock, and leaves its record intact', () => {
    writeLock(OTHER_RUN);

    expect(acquireLock('src/a.ts', deps([ OTHER_PID ]))).toEqual({ outcome: 'held', holder: OTHER_RUN });
    expect(readLockFile()).toEqual(OTHER_RUN);
  });

  it('replaces a lock whose pid is dead, and reports what it removed', () => {
    writeLock(OTHER_RUN);

    expect(acquireLock('src/a.ts', deps([]))).toEqual({ outcome: 'acquired', staleLockRemoved: OTHER_RUN });
    expect(readLockFile().pid).toBe(process.pid);
  });

  it('replaces a lock that does not parse', () => {
    fs.writeFileSync(lockFile, '{"pid":');

    expect(acquireLock('src/a.ts', deps([ OTHER_PID ]))).toEqual({ outcome: 'acquired', staleLockRemoved: undefined });
    expect(readLockFile().pid).toBe(process.pid);
  });

  it('propagates a failure to write the record', () => {
    const missingDir = { ...deps([]), lockFile: path.join(tempDir, 'missing', '.lock') };
    expect(() => acquireLock('src/a.ts', missingDir)).toThrow(/ENOENT/);
  });

  it('leaves nothing behind when moving the record into place fails', () => {
    vi.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw Object.assign(new Error('EACCES'), { code: 'EACCES' });
    });

    expect(() => acquireLock('src/a.ts', deps([]))).toThrow(/EACCES/);
    expect(fs.readdirSync(tempDir)).toEqual([]);
  });
});

describe('releaseLock', () => {
  it('removes the lock this process holds', () => {
    acquireLock('src/a.ts', deps([]));
    releaseLock(deps([]));
    expect(fs.existsSync(lockFile)).toBe(false);
  });

  it('leaves a lock held by another process alone', () => {
    writeLock(OTHER_RUN);
    releaseLock(deps([ OTHER_PID ]));
    expect(readLockFile()).toEqual(OTHER_RUN);
  });

  it('is a no-op without a lock', () => {
    expect(() => releaseLock(deps([]))).not.toThrow();
  });
});

describe('parseLock', () => {
  it('accepts a complete record', () => {
    expect(parseLock('{"pid":1,"startedAt":"x","selection":"y"}')).toEqual({ pid: 1, startedAt: 'x', selection: 'y' });
  });

  it('rejects anything that is not an object with the three typed fields', () => {
    expect(parseLock('null')).toBeUndefined();
    expect(parseLock('42')).toBeUndefined();
    expect(parseLock('{"startedAt":"x","selection":"y"}')).toBeUndefined();
    expect(parseLock('{"pid":1,"selection":"y"}')).toBeUndefined();
    expect(parseLock('{"pid":1,"startedAt":"x"}')).toBeUndefined();
    expect(parseLock('{"pid":"1","startedAt":"x","selection":"y"}')).toBeUndefined();
    expect(parseLock('{"pid":1,"startedAt":2,"selection":"y"}')).toBeUndefined();
    expect(parseLock('{"pid":1,"startedAt":"x","selection":3}')).toBeUndefined();
  });
});

describe('messages', () => {
  const lock: RunLock = { pid: 7, startedAt: '2026-10-15T09:00:00.000Z', selection: '--changed vs origin/main' };

  it('names the holder, its start time and selection', () => {
    expect(formatHeldMessage(lock)).toBe(
      'Another test:mutation-testing run holds this checkout: pid 7, started 2026-10-15T09:00:00.000Z, ' +
      'mutating --changed vs origin/main. Wait for it to finish, or run from a separate worktree.',
    );
  });

  it('names what a stale lock belonged to', () => {
    expect(formatStaleMessage(lock)).toBe('› removed a stale lock left by pid 7 (started 2026-10-15T09:00:00.000Z, mutating --changed vs origin/main)');
  });
});
