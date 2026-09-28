import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import type { CallRecord } from './grid/shared';
import type { SpecCell, SpecSuspect } from './grid/spec';
import type { Cell, Suspect } from './grid/standards';
import type { OriginsRecord } from './origins/match';
import type { Scope, TouchedFile } from './select/change';
import type { FileWindows } from './select/hunks';
import type { Requirement } from './select/spec';

// One JSON record per run, in the main checkout's `.ai/jev/` so every worktree adds to the same
// dataset and the file outlives the worktree and the task folder. Every cell score is kept, not
// only the suspects, so thresholds can be re-tuned offline without re-running the model.

export const SIDECAR_VERSION = 1;

export type RunStatus = 'ok' | 'skipped' | 'failed';

// `no-spec`: nothing to score. `skipped`: a spec, but no client. `failed`: the spec could not be
// read, or the API failed while scoring it (the cells scored before that stay).
export type SpecRecord =
  { readonly status: 'no-spec' } |
  { readonly status: 'skipped'; readonly reason: string } |
  { readonly status: 'failed'; readonly reason: string; readonly requirements: ReadonlyArray<Requirement>; readonly cells: ReadonlyArray<SpecCell> } |
  {
    readonly status: 'ok';
    readonly requirements: ReadonlyArray<Requirement>;
    readonly cells: ReadonlyArray<SpecCell>;
    readonly suspects: ReadonlyArray<SpecSuspect>;
    readonly cut: number;
  };

export interface SidecarInputs {
  readonly scope: Scope;
  readonly base: string;
  readonly branch: string;
  readonly ticket: string | undefined;
  readonly spec: string | undefined;
  readonly files: ReadonlyArray<TouchedFile>;
}

// The line span of one window, keyed by file and window index — what `--origins` needs to say whether a
// finding's line falls inside a suspect's window once the diff itself is gone.
export interface WindowSpan {
  readonly file: string;
  readonly window: number;
  readonly firstLine: number;
  readonly lastLine: number;
}

export interface SidecarRecord {
  readonly version: number;
  readonly createdAt: string;
  readonly status: RunStatus;
  readonly reason: string | undefined;
  // A past diff screened to tune the thresholds, not a pilot review; `--report` leaves it out.
  readonly calibration: boolean;
  readonly model: string | undefined;
  readonly inputs: SidecarInputs;
  readonly windows: ReadonlyArray<WindowSpan>;
  readonly standards: {
    readonly cells: ReadonlyArray<Cell>;
    readonly suspects: ReadonlyArray<Suspect>;
    readonly cut: number;
  };
  readonly spec: SpecRecord;
  readonly calls: ReadonlyArray<CallRecord>;
  // Wall-clock span of the screen. The calls overlap (`CONCURRENT_REQUESTS`), so their sum overstates
  // what a review waited; a sidecar written before this field existed has none and `--report` falls
  // back to the sum.
  readonly elapsedMs: number | undefined;
  readonly origins: OriginsRecord | undefined;
}

export function windowSpans(files: ReadonlyArray<FileWindows>): Array<WindowSpan> {
  return files.flatMap((target) => target.windows.map((window) => ({
    file: target.file,
    window: window.index,
    firstLine: window.firstLine,
    lastLine: window.lastLine,
  })));
}

export interface SidecarName {
  readonly date: Date;
  readonly branch: string;
  readonly scope: Scope;
  readonly ticket: string | undefined;
}

// `--git-common-dir` is the one answer that is the same from a worktree and from the main checkout;
// git may print it relative to `cwd`.
export function resolveMainCheckout(cwd: string): string {
  const commonDir = execFileSync('git', [ 'rev-parse', '--git-common-dir' ], { cwd, encoding: 'utf8' }).trim();
  return path.dirname(path.resolve(cwd, commonDir));
}

function sanitize(segment: string): string {
  return segment.replace(/[^\w.-]+/g, '-');
}

export function sidecarFileName(name: SidecarName): string {
  const date = name.date.toISOString().slice(0, 'YYYY-MM-DD'.length);
  const ticket = name.ticket === undefined ? '' : `-${ sanitize(name.ticket) }`;
  return `${ date }-${ sanitize(name.branch) }-${ name.scope }${ ticket }.json`;
}

export function writeSidecar(filePath: string, record: SidecarRecord): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${ JSON.stringify(record, null, 2) }\n`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  // Stryker disable next-line ConditionalExpression: a primitive reads `version` as undefined and fails readSidecar the same way; the guard only narrows
  if (typeof value !== 'object') return false;
  return value !== null;
}

export function readSidecar(filePath: string): SidecarRecord {
  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!isRecord(parsed) || parsed.version !== SIDECAR_VERSION) throw new Error(`Not a review-screen sidecar (version ${ SIDECAR_VERSION }): ${ filePath }`);
  // Only this tool writes the folder, and the version check above is the one field an edited file
  // could drift on; validating every cell of a record we wrote ourselves would double the module.
  const record = parsed as unknown as SidecarRecord;
  // A sidecar written before `windows`, `calibration` or `elapsedMs` existed still reads: its suspects
  // match on the exact line, and it counts as a pilot review.
  return { ...record, calibration: record.calibration ?? false, windows: record.windows ?? [], elapsedMs: record.elapsedMs, origins: record.origins };
}
