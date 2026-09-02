import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { JSON_REPORT_FILE, STRYKER_BIN, STRYKER_CONFIG_FILE } from '../config';
import type { MutateTarget } from '../select/files';

// Runs Stryker over a selection. Everything that does not vary per run lives in the committed
// stryker.config.json, so the only thing passed on the command line is what to mutate.

const EXEC_MAX_BUFFER = 64 * 1024 * 1024;

// Stryker rejects a mutation range on a pattern minimatch reads as a glob, and Next.js route files
// (`src/pages/tx/[hash].tsx`) are exactly that. Escaping the metacharacters makes the pattern
// literal — which is also the only form that matches such a path at all.
const GLOB_METACHARACTERS = /([[\]{}()*?!+@])/g;

// One `mutate` entry per range: Stryker unions the ranges it is given for the same file, and a file
// named with no range at all would be mutated in full.
export function formatMutateTargets(targets: ReadonlyArray<MutateTarget>): Array<string> {
  return targets.flatMap(({ file, ranges }) => {
    const pattern = file.replace(GLOB_METACHARACTERS, '\\$1');
    return ranges.map(([ start, end ]) => `${ pattern }:${ start }-${ end }`);
  });
}

export function runStryker(targets: ReadonlyArray<MutateTarget>): void {
  fs.mkdirSync(path.dirname(JSON_REPORT_FILE), { recursive: true });
  // A run that dies leaves the previous run's report on disk, and reading that would present stale
  // results as fresh ones. Removing it first makes a failed run visibly report-less instead.
  fs.rmSync(JSON_REPORT_FILE, { force: true });

  // The config file is a positional argument to `stryker run`, not a flag. --mutate takes one
  // comma-separated list; repeating the flag overwrites it rather than appending.
  const args = [ 'run', STRYKER_CONFIG_FILE, '--mutate', formatMutateTargets(targets).join(',') ];
  execFileSync(STRYKER_BIN, args, { stdio: 'inherit', maxBuffer: EXEC_MAX_BUFFER });
}
