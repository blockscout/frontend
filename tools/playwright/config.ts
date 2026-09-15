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

// Changes that reach the browser outside the bundler's module graph, so `--only-changed` cannot see
// them: the sprite (built at run time from src/sprite/icons), the harness template files, the config, the
// lockfile. Any hit under --changed runs the whole suite. A trailing slash means "everything under";
// the other entries match one exact path. Paired with the `pw_changes` gate step in
// .github/workflows/checks.yml, which lists the same paths so an empty diff there skips the matrix —
// keep the two in sync.
export const FORCE_FULL_PATHS: ReadonlyArray<string> = [
  'src/sprite/icons/',
  'playwright/',
  PLAYWRIGHT_CONFIG_FILE,
  'pnpm-lock.yaml',
];

// Where --docker runs. The tag is derived at run time from the installed @playwright/test version,
// because the browsers baked into the image must match the runner. The name and the OS suffix are
// paired with `container.image` in .github/workflows/checks.yml — keep the two in sync, so a Mac
// --docker run renders with the same browsers as CI.
export const DOCKER_IMAGE_NAME = 'mcr.microsoft.com/playwright';
export const DOCKER_IMAGE_OS_SUFFIX = '-noble';
export const PLAYWRIGHT_PACKAGE_FILE = path.join('node_modules', '@playwright', 'test', 'package.json');
export const PACKAGE_FILE = 'package.json';

// The Linux dependency tree --docker mounts over node_modules, so Node inside the container resolves
// the Linux-native optional packages instead of the Mac ones. --docker-deps installs it, keeping the
// pnpm store in a named volume across installs.
export const LINUX_MODULES_DIR = 'node_modules_linux';
export const LINUX_MODULES_MARKER = path.join(LINUX_MODULES_DIR, '.modules.yaml');
export const PNPM_STORE_VOLUME = 'blockscout-pnpm-linux';
export const CONTAINER_WORKDIR = '/work/';
export const CONTAINER_PNPM_STORE = '/pnpm-store';
