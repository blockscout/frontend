import type { test } from '@playwright/experimental-ct-react';

import createContextWithStorage from './createContextWithStorage';

interface Env {
  name: string;
  value: string;
}

// keep in mind that all passed variables here should be present in env config files (.env.pw or .env.poa)
export default function contextWithEnvsFixture(envs: Array<Env>): Parameters<typeof test.extend>[0]['context'] {
  return async({ browser }, use) => {
    const context = await createContextWithStorage(browser, envs);

    await use(context);
    await context.close();
  };
}
