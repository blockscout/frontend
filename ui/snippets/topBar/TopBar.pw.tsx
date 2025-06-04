import React from 'react';

import { FEATURED_NETWORKS } from 'mocks/config/network';
import * as statsMock from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';

import TopBar from './TopBar';

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS', '[{"text":"Swap","icon":"swap","dappId":"uniswap"}]' ],
    [ 'NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL', 'DUCK' ],
    [ 'NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED', 'true' ],
  ]);
});

test('default view +@dark-mode +@mobile', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('general:stats', statsMock.base);
  const component = await render(<TopBar/>);

  await component.getByText(/\$1\.39/).click();
  await expect(page.getByText(/last update/i)).toBeVisible();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 220 } });

  await component.getByLabel('User settings').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 400 } });
});

test('with secondary coin price +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('general:stats', statsMock.withSecondaryCoin);
  const component = await render(<TopBar/>);
  await expect(component).toHaveScreenshot();
});

test('with network menu +@dark-mode', async({ render, mockApiResponse, mockEnvs, mockConfigResponse, mockAssetResponse, page }) => {
  const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';

  await mockApiResponse('general:stats', statsMock.base);
  await mockEnvs([
    [ 'NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL, FEATURED_NETWORKS);
  await mockAssetResponse('https://localhost:3000/my-logo.png', './playwright/mocks/image_s.jpg');

  const component = await render(<TopBar/>);
  await component.getByLabel('Network menu').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 500 } });

  await page.getByRole('link', { name: 'POA' }).hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 500 } });
});

test('with DeFi dropdown +@dark-mode +@mobile', async({ render, page, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [
      'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS',
      '[{"text":"Swap","icon":"swap","dappId":"uniswap"},{"text":"Payment link","icon":"payment_link","url":"https://example.com"}]',
    ],
  ]);
  await mockApiResponse('general:stats', statsMock.base);

  const component = await render(<TopBar/>);

  await component.getByText(/DeFi/i).click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 220 } });
});

test('with Get gas button', async({ render, mockApiResponse, mockEnvs, mockAssetResponse }) => {
  const ICON_URL = 'https://localhost:3000/my-icon.png';

  await mockEnvs([
    [
      'NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG',
      `{"name": "Need gas?", "dapp_id": "duck", "url_template": "https://duck.url/{chainId}", "logo": "${ ICON_URL }"}`,
    ],
  ]);
  await mockApiResponse('general:stats', statsMock.base);
  await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

  const component = await render(<TopBar/>);
  await expect(component).toHaveScreenshot();
});
