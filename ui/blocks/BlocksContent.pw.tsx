import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import TestApp from 'playwright/TestApp';

import BlocksContent from './BlocksContent';

const API_URL = '/node-api/blocks';

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(blockMock.baseListResponse),
  }));

  const component = await mount(
    <TestApp>
      <BlocksContent/>
    </TestApp>,
  );

  await page.waitForResponse(API_URL),

  await expect(component).toHaveScreenshot();
});
