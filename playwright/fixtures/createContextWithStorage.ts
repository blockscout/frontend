import type { Browser } from '@playwright/test';

import * as app from 'playwright/utils/app';

export default async function createContextWithEnvs(browser: Browser, localStorage: Array<{ name: string; value: string }>) {
  return browser.newContext({
    storageState: {
      origins: [
        { origin: app.url, localStorage },
      ],
      cookies: [],
    },
  });
}
