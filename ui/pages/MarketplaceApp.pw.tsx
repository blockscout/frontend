import { Flex } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import { apps as appsMock } from 'mocks/apps/apps';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';

import MarketplaceApp from './MarketplaceApp';

const MARKETPLACE_CONFIG_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'https://marketplace-config.json') || '';

const hooksConfig = {
  router: {
    query: { id: appsMock[0].id },
    isReady: true,
  },
};

const testFn: Parameters<typeof test>[1] = async({ mount, page }) => {
  await page.route(MARKETPLACE_CONFIG_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(appsMock),
  }));

  await page.route(appsMock[0].url, (route) =>
    route.fulfill({
      status: 200,
      path: './mocks/apps/app.html',
    }),
  );

  const component = await mount(
    <TestApp>
      { /* added Flex as a Layout because the iframe has negative margins */ }
      <Flex flexDirection="column" mx={{ base: 4, lg: 6 }}>
        <MarketplaceApp/>
      </Flex>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
};

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('base view', testFn);
});
