import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { JSON_REPORT_FILE, STRYKER_BIN, STRYKER_CONFIG_FILE } from '../config';

// Runs Stryker over a selection. Everything that does not vary per run lives in the committed
// stryker.config.json, so the only thing passed on the command line is what to mutate.

const EXEC_MAX_BUFFER = 64 * 1024 * 1024;

export function runStryker(mutate: ReadonlyArray<string>): void {
  fs.mkdirSync(path.dirname(JSON_REPORT_FILE), { recursive: true });
  // A run that dies leaves the previous run's report on disk, and reading that would present stale
  // results as fresh ones. Removing it first makes a failed run visibly report-less instead.
  fs.rmSync(JSON_REPORT_FILE, { force: true });

  // The config file is a positional argument to `stryker run`, not a flag. --mutate takes one
  // comma-separated list; repeating the flag overwrites it rather than appending.
  const args = [ 'run', STRYKER_CONFIG_FILE, '--mutate', mutate.join(',') ];
  execFileSync(STRYKER_BIN, args, { stdio: 'inherit', maxBuffer: EXEC_MAX_BUFFER });
}
