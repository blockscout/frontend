import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { FEATURED_NETWORKS_MOCK } from 'mocks/config/network';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';

import NetworkMenu from './NetworkMenu';

const extendedTest = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_MOCK },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

extendedTest.use({ viewport: { width: 1600, height: 1000 } });

extendedTest('base view +@dark-mode', async({ mount, page }) => {
  const LOGO_URL = 'https://example.com/my-logo.png';
  await page.route(LOGO_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
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

  await component.getByText(/optimism/i).hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 450, height: 550 } });
});
