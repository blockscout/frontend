import React from 'react';

import getIconUrl from 'lib/multichain/getIconUrl';
import * as opSuperchainMock from 'mocks/multichain/opSuperchain';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import OpSuperchainAddress from './OpSuperchainAddress';

const CURRENT_ADDRESS = opSuperchainMock.addressA.hash;

const hooksConfig = {
  router: {
    query: { hash: CURRENT_ADDRESS },
  },
};

test('base view', async({ mockApiResponse, render, page, mockMultichainConfig, mockEnvs, mockAssetResponse, mockTextAd }) => {

  await mockMultichainConfig();
  await mockEnvs(ENVS_MAP.opSuperchain);
  await mockTextAd();

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

  await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataA) as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(getIconUrl(opSuperchainMock.chainDataB) as string, './playwright/mocks/image_md.jpg');

  const component = await render(
    <OpSuperchainAddress/>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();

  await component.getByText('By chain').nth(0).click();
  await expect(page.locator('div[data-scope="popover"][data-part="content"]')).toHaveScreenshot();

  await component.getByText('By chain').nth(1).click();
  await expect(page.locator('div[data-scope="popover"][data-part="content"]')).toHaveScreenshot();
});
