import { Flex } from '@chakra-ui/react';
import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect, devices } from 'playwright/lib';

import MarketplaceApp from './MarketplaceApp';

const hooksConfig = {
  router: {
    query: { id: appsMock[0].id },
    isReady: true,
  },
};

const MARKETPLACE_CONFIG_URL = 'https://marketplace-config.json';
const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL),
  ]),
});

const testFn: Parameters<typeof test>[1] = async({ render, mockConfigResponse, mockAssetResponse }) => {
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await mockAssetResponse(appsMock[0].url, './mocks/apps/app.html');

  const component = await render(
    <Flex flexDirection="column" mx={{ base: 4, lg: 6 }}>
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
