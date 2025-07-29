import { Flex } from '@chakra-ui/react';
import React from 'react';
import { numberToHex } from 'viem';

import config from 'configs/app';
import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import type { TestFnArgs } from 'playwright/lib';
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

const testFn = async({ render, mockConfigResponse, mockAssetResponse, mockEnvs, mockRpcResponse }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, appsMock);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, securityReportsMock);
  await mockAssetResponse(appsMock[0].url, './mocks/apps/app.html');
  await mockRpcResponse({
    Method: 'eth_chainId',
    ReturnType: numberToHex(Number(config.chain.id)),
  });

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
