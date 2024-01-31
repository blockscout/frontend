import type { test } from '@playwright/experimental-ct-react';

import createContextWithStorage from './createContextWithStorage';

interface Feature {
  id: string;
  value: unknown;
}

export default function contextWithFeaturesFixture(envs: Array<Feature>): Parameters<typeof test.extend>[0]['context'] {
  return async({ browser }, use) => {
    const storageItems = envs.map(({ id, value }) => ({ name: `pw_feature:${ id }`, value: JSON.stringify(value) }));
    const context = await createContextWithStorage(browser, storageItems);

    await use(context);
    await context.close();
  };
}
