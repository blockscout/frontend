import fs from 'fs';

import { LOCK_FILE } from '../config';

// One run per checkout. Every run writes to the same report files and the same Stryker sandbox, so a
// second run started while the first is still going wipes the first's output and leaves either run
// reading the other's results. The lock names the holder so the message can say what to wait for.

export interface RunLock {
  readonly pid: number;
  readonly startedAt: string;
  readonly selection: string;
}

export interface LockDeps {
  readonly lockFile: string;
  readonly isProcessAlive: (pid: number) => boolean;
  readonly now: () => Date;
}

export type LockAttempt =
  { readonly outcome: 'acquired'; readonly staleLockRemoved: RunLock | undefined } |
  { readonly outcome: 'held'; readonly holder: RunLock };

function isRunLock(value: unknown): value is RunLock {
  const record = value as Partial<RunLock> | null | undefined;
  return typeof record?.pid === 'number' && typeof record?.startedAt === 'string' && typeof record?.selection === 'string';
}

// A lock that does not parse is treated as stale: it was either half-written by a run that died in
// that instant or edited by hand, and in neither case does a live run depend on it.
export function parseLock(contents: string): RunLock | undefined {
  try {
    const parsed: unknown = JSON.parse(contents);
    return isRunLock(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function formatHeldMessage(holder: RunLock): string {
  return `Another test:mutation-testing run holds this checkout: pid ${ holder.pid }, started ${ holder.startedAt }, ` +
    `mutating ${ holder.selection }. Wait for it to finish, or run from a separate worktree.`;
}

export function formatStaleMessage(stale: RunLock): string {
  return `› removed a stale lock left by pid ${ stale.pid } (started ${ stale.startedAt }, mutating ${ stale.selection })`;
}

function readLock(lockFile: string): RunLock | undefined {
  try {
    return parseLock(fs.readFileSync(lockFile, 'utf8'));
  } catch {
    return undefined;
  }
}

function errorCode(error: unknown): unknown {
  return (error as { readonly code?: unknown } | null | undefined)?.code;
}

function removeFile(file: string): void {
  try {
    fs.unlinkSync(file);
  } catch { /* Already gone, which is the state being asked for. */ }
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means the pid exists but belongs to another user — alive, just not ours to signal.
    return errorCode(error) === 'EPERM';
  }
}

// The record is written in full to a private file and renamed over the lock, so no reader can ever
// see the lock half-written — an open-then-write would expose an empty file in between.
function writeLock(lockFile: string, lock: RunLock): void {
  const draft = `${ lockFile }.${ lock.pid }.draft`;
  try {
    fs.writeFileSync(draft, JSON.stringify(lock));
    fs.renameSync(draft, lockFile);
  } finally {
    removeFile(draft);
  }
}

// Reading the lock, judging its holder dead and replacing it are three steps, and a second run doing
// the same three in between would end with two runs each believing it holds the lock. A directory is
// the one thing every platform creates atomically and exclusively, so it serialises the sequence.
function acquireExclusively<T>(lockFile: string, attempt: () => T): T {
  const marker = `${ lockFile }.acquiring`;
  try {
    fs.mkdirSync(marker);
  } catch (error) {
    if (errorCode(error) !== 'EEXIST') throw error;
    throw new Error(`Another test:mutation-testing run is taking ${ lockFile } this instant — start the run again. ` +
      `If that keeps failing, remove ${ marker }: it was left by a run killed mid-step.`);
  }
  try {
    return attempt();
  } finally {
    fs.rmdirSync(marker);
  }
}

const DEFAULT_DEPS: LockDeps = { lockFile: LOCK_FILE, isProcessAlive: isAlive, now: () => new Date() };

// A record whose pid is dead is left over from a run that was killed outright and never reached
// releaseLock; it is replaced rather than refused.
export function acquireLock(selection: string, deps: LockDeps = DEFAULT_DEPS): LockAttempt {
  const lock: RunLock = { pid: process.pid, startedAt: deps.now().toISOString(), selection };

  return acquireExclusively(deps.lockFile, () => {
    const holder = readLock(deps.lockFile);
    if (holder !== undefined && deps.isProcessAlive(holder.pid)) return { outcome: 'held', holder };

    writeLock(deps.lockFile, lock);
    return { outcome: 'acquired', staleLockRemoved: holder };
  });
}

// Only the holder removes its own record: a run that lost the race must not release the winner's.
export function releaseLock(deps: LockDeps = DEFAULT_DEPS): void {
  if (readLock(deps.lockFile)?.pid !== process.pid) return;
  removeFile(deps.lockFile);
}
