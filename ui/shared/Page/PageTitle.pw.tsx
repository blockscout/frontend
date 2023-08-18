import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import TestApp from 'playwright/TestApp';

import DefaultView from './specs/DefaultView';
import LongNameAndManyTags from './specs/LongNameAndManyTags';
import WithTextAd from './specs/WithTextAd';

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

test('default view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <DefaultView/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with text ad +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <WithTextAd/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with long name and many tags +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <LongNameAndManyTags/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
