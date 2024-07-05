import React from 'react';

import { test, expect, devices } from 'playwright/lib';

import HeaderMobile from './HeaderMobile';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('default view +@dark-mode', async({ render, page }) => {
  await render(<HeaderMobile/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
});
