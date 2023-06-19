import type { test } from '@playwright/experimental-ct-react';
import type { Browser } from '@playwright/test';

import * as app from 'playwright/utils/app';

interface Env {
  name: string;
  value: string;
}

// keep in mind that all passed variables here should be present in env config files (.env.pw or .env.poa)
export default function contextWithEnvsFixture(envs: Array<Env>): Parameters<typeof test.extend>[0]['context'] {
  return async({ browser }, use) => {
    const context = await createContextWithEnvs(browser, envs);

    await use(context);
    await context.close();
  };
}

export async function createContextWithEnvs(browser: Browser, envs: Array<Env>) {
  return browser.newContext({
    storageState: {
      origins: [
        { origin: app.url, localStorage: envs },
      ],
      cookies: [],
    },
  });
}
