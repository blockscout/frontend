import path from 'path';

import strykerConfig from './stryker.config.json';

export const DEFAULT_BASE_REF = 'origin/main';

const TOOL_DIR = path.join('tools', 'mutation-testing');

export const STRYKER_BIN = path.join('node_modules', '.bin', 'stryker');
export const STRYKER_CONFIG_FILE = path.join(TOOL_DIR, 'stryker.config.json');

// Read off the committed config rather than restated here: the reporter writes where that file says,
// and a second copy of the path would silently start reading a report nobody writes.
export const JSON_REPORT_FILE = strykerConfig.jsonReporter.fileName;
export const HTML_REPORT_FILE = strykerConfig.htmlReporter.fileName;
export const SANDBOX_DIR = strykerConfig.tempDirName;

// Stryker's own json report is written only once a whole run finishes, so a run stopped at its
// budget would leave nothing behind. ./stryker/streaming-reporter.mts appends a record here as each
// mutant is tested, and ./stryker/stream.ts reads it back when the run did not finish.
export const STREAM_REPORT_FILE = path.join(TOOL_DIR, 'reports', 'mutation.ndjson');

// src/toolkit/utils/consts, which owns the shared unit constants, sits outside this tool's tsconfig
// rootDir and cannot be imported here.
export const MINUTE_MS = 60 * 1_000;

// A run is bounded by wall-clock time rather than mutant count because cost follows import-graph
// centrality: one 28-mutant file imported across the app costs more than five leaf utilities with
// 140 between them, since Stryker's dry run executes everything related to what it mutates.
// Overridable per invocation with --budget.
export const DEFAULT_BUDGET_MS = 15 * MINUTE_MS;

// How long the stopped process group gets to exit on its own before it is killed outright.
export const STOP_GRACE_MS = 5 * 1_000;
