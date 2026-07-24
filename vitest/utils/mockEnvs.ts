/* eslint-disable no-restricted-properties -- patching raw envs (and re-evaluating src/config) is this utility's purpose */
import { vi } from 'vitest';

// The Vitest counterpart of the Playwright `mockEnvs` fixture: applies env overrides and
// re-evaluates the config graph. `src/config` is a frozen module-level singleton (and page
// modules capture feature configs into module-scope consts), so overriding envs only works
// together with `vi.resetModules()` — which means everything that reads config must be
// imported dynamically INSIDE `run`, not statically at the top of the spec file.
//
// Env bundles for common feature setups live in `src/config/test-utils/env-presets.ts`
// (shared with the Playwright suite).
export default async function withEnvs<T>(
  envs: Array<[ string, string ]> | undefined,
  run: () => Promise<T>,
): Promise<T> {
  const names = (envs ?? []).map(([ name ]) => name);

  const windowSnapshot = typeof window !== 'undefined' ? { ...window.__envs } : undefined;
  const processSnapshot = Object.fromEntries(names.map((name) => [ name, process.env[name] ]));

  for (const [ name, value ] of envs ?? []) {
    process.env[name] = value;
    if (typeof window !== 'undefined') {
      window.__envs = { ...window.__envs, [name]: value };
    }
  }

  vi.resetModules();

  try {
    return await run();
  } finally {
    if (windowSnapshot && typeof window !== 'undefined') {
      window.__envs = windowSnapshot;
    }
    for (const name of names) {
      const value = processSnapshot[name];
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
    vi.resetModules();
  }
}
