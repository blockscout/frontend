import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import { FEATURED_NETWORKS_MOCK } from 'mocks/config/network';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';

import NetworkMenu from './NetworkMenu';

const FEATURED_NETWORKS_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', 'https://localhost:3000/featured-networks.json') || '';

const extendedTest = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

extendedTest.use({ viewport: { width: 1600, height: 1000 } });

extendedTest('base view +@dark-mode', async({ mount, page }) => {
  const LOGO_URL = 'https://localhost:3000/my-logo.png';
  await page.route(LOGO_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
  await page.route(FEATURED_NETWORKS_URL, (route) => {
    return route.fulfill({
      status: 200,
      body: FEATURED_NETWORKS_MOCK,
    });
  });

  const component = await mount(
    <TestApp>
      <NetworkMenu/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 36, height: 36 } });

  await component.locator('button[aria-label="Network menu"]').hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 36, height: 36 } });

  await component.locator('button[aria-label="Network menu"]').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 450, height: 550 } });

  await component.getByText(/poa/i).hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 450, height: 550 } });
});
