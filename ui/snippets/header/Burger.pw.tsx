import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import { FEATURED_NETWORKS_MOCK } from 'mocks/config/network';
import authFixture from 'playwright/fixtures/auth';
import contextWithEnvs, { createContextWithEnvs } from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';

import Burger from './Burger';

const FEATURED_NETWORKS_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', 'https://localhost:3000/featured-networks.json') || '';
const LOGO_URL = 'https://localhost:3000/my-logo.png';

base.use({ viewport: devices['iPhone 13 Pro'].viewport });

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('base view', async({ mount, page }) => {
  await page.route(FEATURED_NETWORKS_URL, (route) => {
    return route.fulfill({
      body: FEATURED_NETWORKS_MOCK,
    });
  });
  await page.route(LOGO_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <Burger/>
    </TestApp>,
    { hooksConfig },
  );

  await component.locator('svg[aria-label="Menu button"]').click();
  await expect(page.locator('.chakra-modal__content-container')).toHaveScreenshot();

  await page.locator('button[aria-label="Network menu"]').click();
  await expect(page).toHaveScreenshot();
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('base view', async({ mount, page }) => {
    await page.route(FEATURED_NETWORKS_URL, (route) => {
      return route.fulfill({
        body: FEATURED_NETWORKS_MOCK,
      });
    });
    await page.route(LOGO_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });

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

test('submenu', async({ mount, page }) => {
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

test.describe('auth', () => {
  const extendedTest = base.extend({
    context: async({ browser }, use) => {
      const context = await createContextWithEnvs(browser, [
        { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
      ]);
      authFixture(context);
      use(context);
    },
  });

  extendedTest.use({ viewport: { width: devices['iPhone 13 Pro'].viewport.width, height: 800 } });

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
});
