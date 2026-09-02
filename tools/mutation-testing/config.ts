import path from 'path';

import strykerConfig from './stryker.config.json';

export const DEFAULT_BASE_REF = 'origin/main';

const TOOL_DIR = path.join('tools', 'mutation-testing');

export const STRYKER_BIN = path.join('node_modules', '.bin', 'stryker');
export const STRYKER_CONFIG_FILE = path.join(TOOL_DIR, 'stryker.config.json');

// Read off the committed config rather than restated here: the reporter writes where that file says,
// and a second copy of the path would silently start reading a report nobody writes.
export const JSON_REPORT_FILE = strykerConfig.jsonReporter.fileName;
