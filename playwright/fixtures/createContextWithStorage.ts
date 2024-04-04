import type { Browser } from '@playwright/test';

import * as app from 'playwright/utils/app';

/**
 * @deprecated please use storageState fixture
 *
 * @export
 * @param {Browser} browser
 * @param {Array<{ name: string; value: string }>} localStorage
 * @return {*}
 */
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
