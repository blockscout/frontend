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
  return typeof value === 'object' && value !== null &&
    typeof (value as RunLock).pid === 'number' &&
    typeof (value as RunLock).startedAt === 'string' &&
    typeof (value as RunLock).selection === 'string';
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

function errorCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : undefined;
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

function tryCreate(lockFile: string, lock: RunLock): boolean {
  try {
    fs.writeFileSync(lockFile, JSON.stringify(lock), { flag: 'wx' });
    return true;
  } catch (error) {
    if (errorCode(error) === 'EEXIST') return false;
    throw error;
  }
}

const DEFAULT_DEPS: LockDeps = { lockFile: LOCK_FILE, isProcessAlive: isAlive, now: () => new Date() };

// Creation is exclusive (`wx`), so two runs racing for the file cannot both win; the loser then reads
// the winner's record. A record whose pid is dead is left over from a run that was killed outright
// and never reached releaseLock — it is removed and the attempt made once more.
export function acquireLock(selection: string, deps: LockDeps = DEFAULT_DEPS): LockAttempt {
  const lock: RunLock = { pid: process.pid, startedAt: deps.now().toISOString(), selection };
  let staleLockRemoved: RunLock | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    if (tryCreate(deps.lockFile, lock)) return { outcome: 'acquired', staleLockRemoved };

    const holder = readLock(deps.lockFile);
    if (holder !== undefined && deps.isProcessAlive(holder.pid)) return { outcome: 'held', holder };

    staleLockRemoved = holder;
    fs.rmSync(deps.lockFile, { force: true });
  }

  return { outcome: 'held', holder: readLock(deps.lockFile) ?? lock };
}

// Only the holder removes its own record: a run that lost the race must not release the winner's.
export function releaseLock(deps: LockDeps = DEFAULT_DEPS): void {
  if (readLock(deps.lockFile)?.pid !== process.pid) return;
  fs.rmSync(deps.lockFile, { force: true });
}
