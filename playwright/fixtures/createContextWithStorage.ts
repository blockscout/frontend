import type { Browser } from '@playwright/test';

import config from 'configs/app';

/**
 * @deprecated please use mockEnvs or mockFeatures fixture
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
        { origin: config.app.baseUrl, localStorage },
      ],
      cookies: [],
    },
  });
}
