import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import HeaderMobile from './HeaderMobile';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('default view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <HeaderMobile/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
});
