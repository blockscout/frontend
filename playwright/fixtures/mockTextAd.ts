import type { TestFixture, Page } from '@playwright/test';

import * as textAdMock from 'mocks/ad/textAd';

export type MockTextAdFixture = () => Promise<void>;

const fixture: TestFixture<MockTextAdFixture, { page: Page }> = async({ page }, use) => {
  await use(async() => {

    await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
      status: 200,
      json: textAdMock.duck,
    }));
    await page.route(textAdMock.duck.ad.thumbnail, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });
  });
};

export default fixture;
