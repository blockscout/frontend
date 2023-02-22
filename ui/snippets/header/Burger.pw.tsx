import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';

import Burger from './Burger';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

test('base view', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Burger/>
    </TestApp>,
    { hooksConfig },
  );

  await component.locator('svg[aria-label="Menu button"]').click();
  await expect(page).toHaveScreenshot();

  await page.locator('button[aria-label="Network menu"]').click();
  await expect(page).toHaveScreenshot();
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('base view', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <Burger/>
      </TestApp>,
      { hooksConfig },
    );

    await component.locator('svg[aria-label="Menu button"]').click();
    await expect(page).toHaveScreenshot();

    await page.locator('button[aria-label="Network menu"]').click();
    await expect(page).toHaveScreenshot();
  });
});

test.describe('auth', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      authFixture(context);
      use(context);
    },
  });

  extendedTest('base view', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <Burger/>
      </TestApp>,
      { hooksConfig },
    );

    await component.locator('svg[aria-label="Menu button"]').click();
    await expect(page).toHaveScreenshot();
  });

  extendedTest('submenu', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <Burger/>
      </TestApp>,
      { hooksConfig },
    );

    await component.locator('svg[aria-label="Menu button"]').click();
    await page.locator('div[aria-label="Blockchain link group"]').click();
    await expect(page).toHaveScreenshot();
  });
});
