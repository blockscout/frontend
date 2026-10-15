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
  it('creates the lock naming this process and the selection, and nothing else', () => {
    expect(acquireLock('src/a.ts', deps([]))).toEqual({ outcome: 'acquired', staleLockRemoved: undefined });
    expect(readLockFile()).toEqual({ pid: process.pid, startedAt: NOW.toISOString(), selection: 'src/a.ts' });
    expect(fs.readdirSync(tempDir)).toEqual([ '.lock' ]);
  });

  // A reader must never see the record half-written, so it is linked into place complete.
  it('writes the record in one step', () => {
    const link = vi.spyOn(fs, 'linkSync');
    acquireLock('src/a.ts', deps([]));
    expect(link).toHaveBeenCalledWith(expect.stringContaining(process.pid.toString()), lockFile);
  });

  // The loser of the exclusive create must not clear the record the winner just wrote.
  it('reports held when another run wins the create, and leaves its record and no draft behind', () => {
    const winner: RunLock = { pid: OTHER_PID + 1, startedAt: NOW.toISOString(), selection: 'src/c.ts' };
    const originalLinkSync = fs.linkSync.bind(fs);
    vi.spyOn(fs, 'linkSync').mockImplementation((from, to) => {
      writeLock(winner);
      originalLinkSync(from, to);
    });

    expect(acquireLock('src/a.ts', deps([ winner.pid ]))).toEqual({ outcome: 'held', holder: winner });
    expect(readLockFile()).toEqual(winner);
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

  // Two runs reclaim the same dead lock: the one that gets there second must not unlink the record the
  // first has just put in its place.
  it('leaves a stale lock alone once another run has already replaced it', () => {
    const winner: RunLock = { pid: OTHER_PID + 1, startedAt: NOW.toISOString(), selection: 'src/c.ts' };
    writeLock(OTHER_RUN);
    const replacedDuringLivenessCheck: LockDeps = {
      ...deps([ winner.pid ]),
      isProcessAlive: (pid) => {
        writeLock(winner);
        return pid === winner.pid;
      },
    };

    expect(acquireLock('src/a.ts', replacedDuringLivenessCheck)).toEqual({ outcome: 'held', holder: winner });
    expect(readLockFile()).toEqual(winner);
  });

  it('never claims a holder it cannot read back', () => {
    vi.spyOn(fs, 'linkSync').mockImplementation(() => {
      throw Object.assign(new Error('EEXIST'), { code: 'EEXIST' });
    });

    expect(() => acquireLock('src/a.ts', deps([]))).toThrow(/changed underneath this run twice/);
    expect(fs.existsSync(lockFile)).toBe(false);
  });

  it('propagates a failure to write the record', () => {
    const missingDir = { ...deps([]), lockFile: path.join(tempDir, 'missing', '.lock') };
    expect(() => acquireLock('src/a.ts', missingDir)).toThrow(/ENOENT/);
  });

  it('propagates a failure to link the record other than the lock already existing', () => {
    vi.spyOn(fs, 'linkSync').mockImplementation(() => {
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
