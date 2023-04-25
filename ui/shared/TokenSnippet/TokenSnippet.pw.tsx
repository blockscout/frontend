import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import TokenSnippet from './TokenSnippet';

const API_URL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/assets/0x363574E6C5C71c343d7348093D84320c76d5Dd29/logo.png';

test.use(devices['iPhone 13 Pro']);

test('unnamed', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenSnippet hash="0x363574E6C5C71c343d7348093D84320c76d5Dd29" symbol="xDAI"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('named', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenSnippet hash="0x363574E6C5C71c343d7348093D84320c76d5Dd29" name="Shavuha token" symbol="SHA"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with logo', async({ mount, page }) => {
  await page.route(API_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <TokenSnippet hash="0x363574E6C5C71c343d7348093D84320c76d5Dd29"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
