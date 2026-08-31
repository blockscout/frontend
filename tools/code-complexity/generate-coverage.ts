/* eslint-disable no-console -- CLI: surfacing vitest status to the user is part of the job */
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import type { CoverageData } from './coverage';
import { readCoverageOrEmpty } from './coverage';

// Auto-generates coverage by running vitest and reading the coverage-final.json it writes, so a user
// never has to produce a report by hand. Each mode maps to a vitest selection — 'related' →
// `vitest related <paths>`, 'changed' → `vitest run --changed <since>`, 'full' → `vitest run`. All
// three select through the module graph, which is what makes a file's coverage independent of how it
// was reached (./CONTEXT.md).
//
// Output goes to a throwaway temp dir (never the user's ./coverage) and is removed once read.

const VITEST_BIN = path.join('node_modules', '.bin', 'vitest');
const COVERAGE_FILE = 'coverage-final.json';
const EXEC_MAX_BUFFER = 64 * 1024 * 1024;

// Primed-request drift tests (src/server/primedRequests/CONTEXT.md) import huge swaths of the app, so
// `related` pulls them in for almost any file at a large page-mount cost and no useful coverage.
const COVERAGE_TEST_EXCLUDES: ReadonlyArray<string> = [ '**/*.primed.spec.tsx' ];

export type CoverageRequest =
  | { readonly mode: 'related'; readonly paths: ReadonlyArray<string> } |
  { readonly mode: 'changed'; readonly since: string } |
  { readonly mode: 'full' };

export function vitestSelectionArgs(request: CoverageRequest): Array<string> {
  switch (request.mode) {
    case 'related':
      // `related` starts a single run under `--run`, scoped to specs importing the given files.
      return [ 'related', ...request.paths, '--run' ];
    case 'changed':
      return [ 'run', `--changed=${ request.since }` ];
    case 'full':
      return [ 'run' ];
  }
}

export interface GenerateOptions {
  // Stream vitest's own output live instead of capturing it. Off by default so the score table is
  // what the user sees; the captured output is still surfaced if the run fails.
  readonly verbose: boolean;
}

function runVitestCoverage(reportsDirectory: string, request: CoverageRequest, options: GenerateOptions): void {
  const args = [
    ...vitestSelectionArgs(request),
    // A selection with no matching specs still yields (empty) coverage instead of failing the run.
    '--passWithNoTests',
    ...COVERAGE_TEST_EXCLUDES.map((glob) => `--exclude=${ glob }`),
    '--coverage',
    '--coverage.provider=v8',
    '--coverage.reporter=json',
    `--coverage.reportsDirectory=${ reportsDirectory }`,
  ];
  try {
    // Quiet by default: capture vitest's output so only the report table reaches stdout. --verbose
    // streams it live (`inherit`) for debugging a slow or failing run.
    execFileSync(VITEST_BIN, args, {
      stdio: options.verbose ? 'inherit' : [ 'ignore', 'ignore', 'ignore' ],
      maxBuffer: EXEC_MAX_BUFFER,
    });
  } catch {
    // A non-zero vitest exit (a failing test) must not sink the whole gate: vitest still writes
    // coverage for what did run, and the complexity half needs none. Warn and press on with
    // whatever coverage landed — a failing suite means the coverage numbers may be incomplete.
    // Point at --verbose so the hidden failure is recoverable.
    console.error('warning: vitest exited non-zero; coverage may be incomplete (re-run with --verbose to see why).');
  }
}

export function generateCoverage(request: CoverageRequest, options: GenerateOptions): CoverageData {
  const reportsDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'crap-cov-'));
  try {
    if (!options.verbose) console.error('› Running vitest to collect coverage…');
    runVitestCoverage(reportsDirectory, request, options);
    // The report is parsed fully into memory, so the temp dir is safe to delete straight after.
    return readCoverageOrEmpty(path.join(reportsDirectory, COVERAGE_FILE));
  } finally {
    fs.rmSync(reportsDirectory, { recursive: true, force: true });
  }
}
