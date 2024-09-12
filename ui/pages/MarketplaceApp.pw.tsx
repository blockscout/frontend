import { Flex } from '@chakra-ui/react';
import React from 'react';
import { numberToHex } from 'viem';

import config from 'configs/app';
import { apps as appsMock } from 'mocks/apps/apps';
import { ratings as ratingsMock } from 'mocks/apps/ratings';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import { test, expect, devices } from 'playwright/lib';

import MarketplaceApp from './MarketplaceApp';

const hooksConfig = {
  router: {
    query: { id: appsMock[0].id },
    isReady: true,
  },
};

const MARKETPLACE_CONFIG_URL = 'http://localhost:4000/marketplace-config.json';
const MARKETPLACE_SECURITY_REPORTS_URL = 'http://localhost:4000/marketplace-security-reports.json';

const testFn: Parameters<typeof test>[1] = async({ render, mockConfigResponse, mockAssetResponse, mockEnvs, mockRpcResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_API_KEY', 'test' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_BASE_ID', 'test' ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, JSON.stringify(securityReportsMock));
  await mockAssetResponse(appsMock[0].url, './mocks/apps/app.html');
  await mockRpcResponse({
    Method: 'eth_chainId',
    ReturnType: numberToHex(Number(config.chain.id)),
  });
  await page.route('https://api.airtable.com/v0/test/apps_ratings?fields%5B%5D=appId&fields%5B%5D=rating&fields%5B%5D=count', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(ratingsMock),
  }));

  const component = await render(
    <Flex flexDirection="column" mx={{ base: 4, lg: 6 }} h="100vh">
      <MarketplaceApp/>
    </Flex>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
};

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', testFn);
});
