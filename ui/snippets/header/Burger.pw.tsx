import type { BrowserContext } from '@playwright/test';
import React from 'react';

import { FEATURED_NETWORKS } from 'mocks/config/network';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { test, expect, devices } from 'playwright/lib';

import Burger from './Burger';

const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';
const LOGO_URL = 'https://localhost:3000/my-logo.png';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

test.beforeEach(async({ mockEnvs, mockConfigResponse, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL, FEATURED_NETWORKS);
  await mockAssetResponse(LOGO_URL, './playwright/mocks/image_s.jpg');
});

test('base view', async({ render, page }) => {
  const component = await render(<Burger/>, { hooksConfig });

  await component.getByRole('button', { name: 'Menu button' }).click();
  await expect(page).toHaveScreenshot();

  await page.getByRole('button', { name: 'Network menu' }).click();
  await page.mouse.move(0, 0);
  await expect(page).toHaveScreenshot();
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('base view', async({ render, page }) => {
    const component = await render(<Burger/>, { hooksConfig });

    await component.getByRole('button', { name: 'Menu button' }).click();
    await expect(page).toHaveScreenshot();

    await page.getByRole('button', { name: 'Network menu' }).click();
    await page.mouse.move(0, 0);
    await expect(page).toHaveScreenshot();
  });
});

test('submenu', async({ render, page }) => {
  const component = await render(<Burger/>, { hooksConfig });

  await component.getByRole('button', { name: 'Menu button' }).click();
  await page.locator('div[aria-label="Blockchain link group"]').click();
  await expect(page).toHaveScreenshot();
});

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

authTest.describe('auth', () => {
  authTest.use({ viewport: { width: devices['iPhone 13 Pro'].viewport.width, height: 800 } });

  authTest('base view', async({ render, page }) => {
    const component = await render(<Burger/>, { hooksConfig });

    await component.getByRole('button', { name: 'Menu button' }).click();
    await expect(page).toHaveScreenshot();
  });
});
