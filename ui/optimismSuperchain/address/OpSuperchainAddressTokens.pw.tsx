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

test.beforeEach(async({ mockApiResponse, mockMultichainConfig, mockEnvs }) => {
  await mockApiResponse('multichainAggregator:address', opSuperchainMock.addressA, { pathParams: { hash: CURRENT_ADDRESS } });
  await mockApiResponse('multichainAggregator:address_tokens', {
    items: [ opSuperchainMock.tokenA ],
    next_page_params: undefined,
  }, { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: 'ERC-20' } });
  await mockApiResponse('multichainAggregator:address_tokens', {
    items: [ ],
    next_page_params: undefined,
  }, { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: 'ERC-721' } });
  await mockApiResponse('multichainAggregator:address_tokens', {
    items: [ ],
    next_page_params: undefined,
  }, { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: 'ERC-1155' } });
  await mockApiResponse('multichainAggregator:address_tokens', {
    items: [ ],
    next_page_params: undefined,
  }, { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: 'ERC-404' } });
  await mockMultichainConfig();
  await mockEnvs(ENVS_MAP.opSuperchain);
});

test.describe('tokens', () => {
  const hooksConfig = {
    router: {
      query: { hash: CURRENT_ADDRESS, tab: 'tokens_erc20' },
    },
  };
  let component: Locator;

  test.beforeEach(async({ render, mockAssetResponse }) => {
    await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataA) as string, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataB) as string, './playwright/mocks/image_md.jpg');

    component = await render(
      <OpSuperchainAddressTokens addressData={ opSuperchainMock.addressA }/>,
      { hooksConfig },
    );
  });

  test('base view', async({ page }) => {
    await expect(component).toHaveScreenshot();

    await component.getByText('By chain').nth(0).click();
    await expect(page.locator('div[data-scope="popover"][data-part="content"]')).toHaveScreenshot();

    await component.getByText('By chain').nth(1).click();
    await expect(page.locator('div[data-scope="popover"][data-part="content"]')).toHaveScreenshot();

    await component.getByText('By chain').nth(2).click();
    await expect(page.locator('div[data-scope="popover"][data-part="content"]')).toHaveScreenshot();
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });

    test('base view', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('nfts', () => {
  const hooksConfig = {
    router: {
      query: { hash: CURRENT_ADDRESS, tab: 'tokens_nfts' },
    },
  };
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse, mockAssetResponse }) => {
    await mockApiResponse(
      'general:address_collections',
      { ...tokensMock.collections, items: [ tokensMock.collections.items[2] ] },
      { pathParams: { hash: CURRENT_ADDRESS }, queryParams: { type: [] }, chainConfig: opSuperchainMock.chainDataA },
    );
    await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataA) as string, './playwright/mocks/image_s.jpg');

    component = await render(
      <OpSuperchainAddressTokens addressData={ opSuperchainMock.addressA }/>,
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
