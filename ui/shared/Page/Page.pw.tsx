import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import Page from './Page';

const API_URL = '/node-api/index/indexing-status';

test('without indexing alert +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Page>Page Content</Page>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with indexing alert +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ finished_indexing_blocks: false, indexed_blocks_ratio: 0.1 }),
  }));

  const component = await mount(
    <TestApp>
      <Page>Page Content</Page>
    </TestApp>,
  );

  await page.waitForResponse(API_URL),

  await expect(component).toHaveScreenshot();
});
