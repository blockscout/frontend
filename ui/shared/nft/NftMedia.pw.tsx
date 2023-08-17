import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import NftMedia from './NftMedia';

test.use({ viewport: { width: 250, height: 250 } });

test('no url +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <NftMedia url={ null }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('image +@dark-mode', async({ mount, page }) => {
  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';
  await page.route(MEDIA_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_long.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <NftMedia url={ MEDIA_URL }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('page', async({ mount, page }) => {
  const MEDIA_URL = 'https://localhost:3000/page.html';
  const MEDIA_TYPE_API_URL = `/node-api/media-type?url=${ encodeURIComponent(MEDIA_URL) }`;

  await page.route(MEDIA_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/page.html',
    });
  });
  await page.route(MEDIA_TYPE_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ type: 'html' }),
  }));

  const component = await mount(
    <TestApp>
      <NftMedia url={ MEDIA_URL }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
