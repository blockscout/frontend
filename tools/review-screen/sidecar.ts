import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import type { CallRecord, Cell, Suspect } from './grid/standards';
import type { Scope, TouchedFile } from './select/change';

// One JSON record per run, in the main checkout's `.ai/jev/` so every worktree adds to the same
// dataset and the file outlives the worktree and the task folder. Every cell score is kept, not
// only the suspects, so thresholds can be re-tuned offline without re-running the model.

export const SIDECAR_VERSION = 1;

export type RunStatus = 'ok' | 'skipped' | 'failed';

export interface SidecarInputs {
  readonly scope: Scope;
  readonly base: string;
  readonly branch: string;
  readonly ticket: string | undefined;
  readonly spec: string | undefined;
  readonly files: ReadonlyArray<TouchedFile>;
}

export interface SidecarRecord {
  readonly version: number;
  readonly createdAt: string;
  readonly status: RunStatus;
  readonly reason: string | undefined;
  readonly model: string | undefined;
  readonly inputs: SidecarInputs;
  readonly standards: {
    readonly cells: ReadonlyArray<Cell>;
    readonly suspects: ReadonlyArray<Suspect>;
    readonly cut: number;
  };
  readonly spec: { readonly status: 'not-implemented' };
  readonly calls: ReadonlyArray<CallRecord>;
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
