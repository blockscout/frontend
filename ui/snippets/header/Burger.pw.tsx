import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';

import Burger from './Burger';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Burger/>
    </TestApp>,
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
    );

    await component.locator('svg[aria-label="Menu button"]').click();
    await expect(page).toHaveScreenshot();
  });
});
