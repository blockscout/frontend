import { Box } from '@chakra-ui/react';
import type { Locator } from '@playwright/test';
import React from 'react';

import getIconUrl from 'lib/multichain/getIconUrl';
import * as countersMock from 'mocks/address/counters';
import * as opSuperchainMock from 'mocks/multichain/opSuperchain';
import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import OpSuperchainAddressTokenTransfers from './OpSuperchainAddressTokenTransfers';

const CURRENT_ADDRESS = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

const DEFAULT_PAGINATION = { block_number: 1, index: 1, items_count: 1 };

test.describe('local transfers', () => {
  const hooksConfig = {
    router: {
      query: { hash: CURRENT_ADDRESS, tab: 'token_transfers_local' },
    },
  };
  let component: Locator;

  test.beforeEach(async({ render, mockMultichainConfig, mockEnvs, mockApiResponse, mockAssetResponse, createSocket }) => {
    await mockMultichainConfig();
    await mockEnvs(ENVS_MAP.opSuperchain);
    await mockApiResponse(
      'general:address_token_transfers',
      { items: [ tokenTransferMock.erc20 ], next_page_params: DEFAULT_PAGINATION },
      { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: [] }, chainConfig: opSuperchainMock.chainDataA },
    );
    await mockApiResponse(
      'general:address_counters',
      countersMock.forAddress,
      { pathParams: { hash: CURRENT_ADDRESS }, chainConfig: opSuperchainMock.chainDataA },
    );
    await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataA) as string, './playwright/mocks/image_s.jpg');

    component = await render(
      <Box pt={{ base: '134px', lg: 6 }}>
        <OpSuperchainAddressTokenTransfers/>
      </Box>,
      { hooksConfig },
      { withSocket: true },
    );
    await createSocket();
  });

  test('base view', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });

    test('base view', async() => {
      await expect(component).toHaveScreenshot({ maxDiffPixels: 10 });
    });
  });
});
