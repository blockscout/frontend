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

// Held for the whole of a run. The path is restated in .gitignore and in stryker.config.json's
// ignorePatterns, neither of which can read it from here.
export const LOCK_FILE = path.join(TOOL_DIR, '.lock');

export const STREAM_REPORT_FILE = path.join(TOOL_DIR, 'reports', 'mutation.ndjson');

// src/toolkit/utils/consts, which owns the shared unit constants, sits outside this tool's tsconfig
// rootDir and cannot be imported here.
export const MINUTE_MS = 60 * 1_000;

export const DEFAULT_BUDGET_MS = 15 * MINUTE_MS;

// How long the stopped process group gets to exit on its own before it is killed outright.
export const STOP_GRACE_MS = 5 * 1_000;
