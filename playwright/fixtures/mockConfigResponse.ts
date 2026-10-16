import type { TestFixture, Page } from '@playwright/test';

import type { MockRegistryFixture } from './mockRegistry';

export type MockConfigResponseFixture = (envName: string, envValue: string, content: unknown, isImage?: boolean) => Promise<string>;

const fixture: TestFixture<MockConfigResponseFixture, { page: Page; mockRegistry: MockRegistryFixture }> = async({ page, mockRegistry }, use) => {
  await use(async(envName, envValue, content, isImage) => {
    // Resolved in the page so the base URL reflects the envs mocked for this test.
    const url = await page.evaluate(
      ({ envName, envValue }) => window.__mockUrlBuilder.configAsset(envName, envValue),
      { envName, envValue },
    );

    mockRegistry.registrations.push({ fixture: 'mockConfigResponse', url });

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
