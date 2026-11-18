/* eslint-disable no-restricted-properties -- patching raw envs (and re-evaluating src/config) is this utility's purpose */
import { vi } from 'vitest';

// Applies env overrides and resets the module registry around `run`, so everything that reads the
// config must be imported dynamically INSIDE `run`, not statically at the top of the spec file.
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
