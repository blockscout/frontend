import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import BlockDetails from './BlockDetails';

const API_URL = buildApiUrl('block', { height: '1' });
const hooksConfig = {
  router: {
    query: { height: '1' },
  },
};

test('regular block +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.base),
  }));

  const component = await mount(
    <TestApp>
      <BlockDetails/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('genesis block', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.genesis),
  }));

  const component = await mount(
    <TestApp>
      <BlockDetails/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});
