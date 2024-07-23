import { Grid, Box } from '@chakra-ui/react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import { test, expect, devices } from 'playwright/lib';

import AddressBalance from './AddressBalance';

const ICON_URL = 'https://localhost:3000/my-icon.png';

const eoaWithSmallBalance = {
  ...addressMock.eoa,
  coin_balance: '500000000000000000', // 0.5 * 10^18
  exchange_rate: '1', // 1 USD
};

test('base view', async({ render }) => {
  const component = await render(
    <Grid columnGap={ 8 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <AddressBalance data={ addressMock.eoa } isLoading={ false }/>
    </Grid>,
  );

  await expect(component).toHaveScreenshot();
});

test('with get gas button internal +@dark-mode', async({ render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [
      'NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG',
      `{"name": "Need gas?", "dapp_id": "duck", "url_template": "https://duck.url/{chainId}", "logo": "${ ICON_URL }", "usd_threshold": 1}`,
    ],
  ]);
  await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

  const component = await render(
    <Grid columnGap={ 8 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <AddressBalance data={ eoaWithSmallBalance } isLoading={ false }/>
    </Grid>,
  );

  await expect(component).toHaveScreenshot();
});

test('with get gas button external', async({ render, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [
      'NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG',
      `{"name": "Need gas?", "url_template": "https://duck.url/{chainId}", "logo": "${ ICON_URL }", "usd_threshold": 1}`,
    ],
  ]);
  await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

  const component = await render(
    <Grid columnGap={ 8 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <AddressBalance data={ eoaWithSmallBalance } isLoading={ false }/>
    </Grid>,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, mockEnvs, mockAssetResponse }) => {
    await mockEnvs([
      [
        'NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG',
        `{"name": "Need gas?", "dapp_id": "duck", "url_template": "https://duck.url/{chainId}", "logo": "${ ICON_URL }", "usd_threshold": 1}`,
      ],
    ]);
    await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

    const component = await render(
      <Box w="300px">
        <Grid columnGap={ 8 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
          <AddressBalance data={ eoaWithSmallBalance } isLoading={ false }/>
        </Grid>
      </Box>,
    );

    await expect(component).toHaveScreenshot();
  });
});
