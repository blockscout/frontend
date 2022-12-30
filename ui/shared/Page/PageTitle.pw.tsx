import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import PageTitle from './PageTitle';

const textAdMock = {
  ad: {
    name: 'Hello utia!',
    description_short: 'Utia is the best! Go with utia! Utia is the best! Go with utia!',
    thumbnail: 'https://utia.utia',
    url: 'https://test.url',
    cta_button: 'Click me!',
  },
};

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock),
  }));
  await page.route(textAdMock.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });
});

test('default view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <PageTitle
        text="Title"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with text ad, back link and addons +@mobile +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <PageTitle
        text="Title"
        withTextAd
        backLinkLabel="Back"
        backLinkUrl="back"
        additionals="Privet"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('long title with text ad, back link and addons +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <PageTitle
        text="This title is long, really long"
        withTextAd
        backLinkLabel="Back"
        backLinkUrl="back"
        additionals="Privet, kak dela?"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
