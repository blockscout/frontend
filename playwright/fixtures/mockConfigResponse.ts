import type { TestFixture, Page } from '@playwright/test';

import config from 'client/config';
import { buildExternalAssetFilePath } from 'client/config/utils/envs';

export type MockConfigResponseFixture = (envName: string, envValue: string, content: unknown, isImage?: boolean) => Promise<string>;

const fixture: TestFixture<MockConfigResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async(envName, envValue, content, isImage) => {
    const url = config.app.baseUrl + buildExternalAssetFilePath(envName, envValue);

    if (isImage && typeof content === 'string') {
      await page.route(url, (route) => route.fulfill({
        status: 200,
        path: content,
      }));
    } else {
      await page.route(url, (route) => route.fulfill({
        status: 200,
        json: content,
      }));
    }

    return url;
  });
};

export default fixture;
