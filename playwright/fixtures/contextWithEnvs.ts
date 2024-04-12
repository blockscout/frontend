import type { test } from '@playwright/experimental-ct-react';

import createContextWithStorage from './createContextWithStorage';

interface Env {
  name: string;
  value: string;
}

/**
 * @deprecated please use mockEnvs fixture
 *
 * @export
 * @param {Array<Env>} envs
 * @return {*}  {Parameters<typeof test.extend>[0]['context']}
 */
export default function contextWithEnvsFixture(envs: Array<Env>): Parameters<typeof test.extend>[0]['context'] {
  return async({ browser }, use) => {
    const context = await createContextWithStorage(browser, envs);

    await use(context);
    await context.close();
  };
}
