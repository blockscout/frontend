import { Box } from '@chakra-ui/react';
import type { Locator } from '@playwright/test';
import React from 'react';

import getIconUrl from 'lib/multichain/getIconUrl';
import * as tokensMock from 'mocks/address/tokens';
import * as opSuperchainMock from 'mocks/multichain/opSuperchain';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import OpSuperchainAddressTokens from './OpSuperchainAddressTokens';

const CURRENT_ADDRESS = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

test.describe('nfts', () => {
  const hooksConfig = {
    router: {
      query: { hash: CURRENT_ADDRESS, tab: 'tokens_nfts' },
    },
  };
  let component: Locator;

  test.beforeEach(async({ render, mockMultichainConfig, mockEnvs, mockApiResponse, mockAssetResponse }) => {
    await mockMultichainConfig();
    await mockEnvs(ENVS_MAP.opSuperchain);
    await mockApiResponse(
      'general:address_collections',
      { ...tokensMock.collections, items: [ tokensMock.collections.items[2] ] },
      { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: [] }, chainConfig: opSuperchainMock.chainDataA },
    );
    await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataA) as string, './playwright/mocks/image_s.jpg');

    component = await render(
      <Box pt={{ base: '134px', lg: 6 }}>
        <OpSuperchainAddressTokens/>
      </Box>,
      { hooksConfig },
    );
  });

  test('base view', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });

    test('base view', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});
