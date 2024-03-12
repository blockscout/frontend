import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import TestApp from 'playwright/TestApp';

import MarketplaceAppInfo from './MarketplaceAppInfo';

test('base view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MarketplaceAppInfo data={ appsMock[0] }/>
    </TestApp>,
  );

  await page.getByText('Info').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 500, height: 400 } });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page }) => {
    await mount(
      <TestApp>
        <MarketplaceAppInfo data={ appsMock[0] }/>
      </TestApp>,
    );

    await page.getByText('Info').click();

    await expect(page).toHaveScreenshot();
  });
});
