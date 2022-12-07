import type { test } from '@playwright/experimental-ct-react';

interface Env {
  name: string;
  value: string;
}

// keep in mind that all passed variables here should be present in env config files (.env.pw or .env.poa)
export default function createContextWithEnvs(envs: Array<Env>): Parameters<typeof test.extend>[0]['context'] {
  return async({ browser }, use) => {
    const context = await browser.newContext({
      storageState: {
        origins: [
          { origin: 'http://localhost:3100', localStorage: envs },
        ],
        cookies: [],
      },
    });

    await use(context);
    await context.close();
  };
}
