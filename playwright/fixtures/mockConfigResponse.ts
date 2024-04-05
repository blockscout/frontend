import type { TestFixture, Page } from '@playwright/test';

import config from 'configs/app';
import { buildExternalAssetFilePath } from 'configs/app/utils';

export type MockConfigResponseFixture = (envName: string, envValue: string, body: string) => Promise<void>;

const fixture: TestFixture<MockConfigResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async(envName, envValue, body) => {
    const url = config.app.baseUrl + buildExternalAssetFilePath(envName, envValue);

    await page.route(url, (route) => route.fulfill({
      status: 200,
      body,
    }));
  });
};

export default fixture;
