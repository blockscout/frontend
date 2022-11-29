import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import TestApp from 'playwright/TestApp';

import Stats from './Stats';

const API_URL = '/node-api/stats';

test('all items +@mobile +@dark-mode +@desktop-xl', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <Stats/>
    </TestApp>,
  );
  await page.waitForResponse(API_URL),

  await expect(component).toHaveScreenshot();
});
