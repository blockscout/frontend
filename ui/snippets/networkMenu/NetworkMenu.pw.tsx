import React from 'react';

import { FEATURED_NETWORKS_MOCK } from 'mocks/config/network';
import { test, expect } from 'playwright/lib';

import NetworkMenu from './NetworkMenu';

const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';
const LOGO_URL = 'https://localhost:3000/my-logo.png';

test.use({ viewport: { width: 1600, height: 1000 } });

test('base view +@dark-mode', async({ render, page, mockConfigResponse, mockAssetResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL, FEATURED_NETWORKS_MOCK);
  await mockAssetResponse(LOGO_URL, './playwright/mocks/image_s.jpg');

  const component = await render(<NetworkMenu/>);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 36, height: 36 } });

  await component.locator('button[aria-label="Network menu"]').hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 36, height: 36 } });

  await component.locator('button[aria-label="Network menu"]').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 450, height: 550 } });

  await component.getByText(/poa/i).hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 450, height: 550 } });
});
