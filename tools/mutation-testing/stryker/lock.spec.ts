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
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('acquireLock', () => {
  it('creates the lock naming this process and the selection', () => {
    expect(acquireLock('src/a.ts', deps([]))).toEqual({ outcome: 'acquired', staleLockRemoved: undefined });
    expect(readLockFile()).toEqual({ pid: process.pid, startedAt: NOW.toISOString(), selection: 'src/a.ts' });
  });

  // Two fresh runs race for the file: the exclusive create decides it, so the loser must never get to
  // unlink the record the winner just wrote.
  it('never removes anything when no lock is there to remove', () => {
    const unlink = vi.spyOn(fs, 'unlinkSync');
    acquireLock('src/a.ts', deps([]));
    expect(unlink).not.toHaveBeenCalled();
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

  // The loser of the race must not clear a record it did not write.
  it('reports held when another run takes the file between the stale removal and the retry', () => {
    const winner: RunLock = { pid: OTHER_PID + 1, startedAt: NOW.toISOString(), selection: 'src/c.ts' };
    writeLock(OTHER_RUN);
    const originalUnlinkSync = fs.unlinkSync.bind(fs);
    vi.spyOn(fs, 'unlinkSync').mockImplementation((target) => {
      originalUnlinkSync(target);
      writeLock(winner);
    });

    expect(acquireLock('src/a.ts', deps([ winner.pid ]))).toEqual({ outcome: 'held', holder: winner });
    expect(readLockFile()).toEqual(winner);
  });

  it('propagates a failure other than the file already existing', () => {
    const missingDir = { ...deps([]), lockFile: path.join(tempDir, 'missing', '.lock') };
    expect(() => acquireLock('src/a.ts', missingDir)).toThrow(/ENOENT/);
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
