import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import TestApp from 'playwright/TestApp';

import PageTitle from './PageTitle';
import CompositeSpec from './specs/Composite.spec';

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
  await page.route('https://example.com/logo.png', (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('simple title +@mobile', async({ mount }) => {
  const backLink = {
    label: 'Back to tokens list',
    url: 'http://localhost:3000/tokens',
  };
  const component = await mount(
    <TestApp>
      <PageTitle withTextAds backLink={ backLink }>
        Verified contracts
      </PageTitle>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('composite title +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <CompositeSpec/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
