import path from 'path';

export const DEFAULT_BASE_REF = 'origin/main';

export const PLAYWRIGHT_BIN = path.join('node_modules', '.bin', 'playwright');
export const PLAYWRIGHT_CONFIG_FILE = 'playwright-ct.config.ts';

// The browser-side envs for component tests. The pre-run steps turn this file into the
// window.__envs script the test harness (playwright/index.ts) loads.
export const ENV_FILE = path.join('playwright', '.env.pw');
export const ENVS_SCRIPT_FILE = path.join('playwright', 'envs.js');
export const MAKE_ENVS_SCRIPT = path.join('deploy', 'scripts', 'make_envs_script.sh');

// The sprite build skips content hashing under this app env, so the harness can load a fixed
// sprite.svg path.
export const SPRITE_APP_ENV = 'pw';

// The CT bundle of the whole app does not fit Node's default heap.
export const PLAYWRIGHT_NODE_OPTIONS = '--max-old-space-size=8192';

// Playwright's build cache for the component bundle; see the commented-out step in ./index.ts.
export const PLAYWRIGHT_CACHE_DIR = path.join('playwright', '.cache');
