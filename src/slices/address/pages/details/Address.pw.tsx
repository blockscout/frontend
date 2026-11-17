import React from 'react';
import { numberToHex } from 'viem';

import * as addressMock from 'src/slices/address/mocks/address';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as addressCountersMock from 'src/slices/address/mocks/counters';
import * as addressTabCountersMock from 'src/slices/address/mocks/tab-counters';
import * as statsMock from 'src/slices/chain/stats/mocks';
import { tokenInfo } from 'src/slices/token/mocks/info';

import { generateAddressMetadataInfo, nameTag } from 'src/features/address-metadata/mocks/tags';
import * as solidityscanReportMock from 'src/features/solidity-scan/mocks';

import config from 'src/config';

import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Address from './Address';

const hooksConfig = {
  router: {
    query: { hash: addressParamMock.hash },
  },
};

const addressMetadataQueryParams = {
  addresses: [ addressParamMock.hash ],
  chainId: config.chain.id,
  tagsLimit: '20',
};

const ensLookupQueryParams = {
  address: addressParamMock.hash,
  protocols: [ 'ens' ],
  resolved_to: true,
  owned_by: true,
  only_active: true,
  order: 'ASC',
};

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test.describe('fetched bytecode', () => {
  test('should refetch address query', async({ render, mockApiResponse, createSocket, page }) => {
    const addressApiUrl = await mockApiResponse('core:address', addressMock.validator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:stats', statsMock.base);
    await mockApiResponse('metadata:info', generateAddressMetadataInfo(addressParamMock.hash, nameTag), { queryParams: addressMetadataQueryParams });
    await mockApiResponse('metadata:address_submit', null as never);
    await mockApiResponse('bens:addresses_lookup', { items: [], next_page_params: undefined }, { queryParams: ensLookupQueryParams });
    await render(<Address/>, { hooksConfig }, { withSocket: true });

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ addressParamMock.hash.toLowerCase() }`);
    socketServer.sendMessage(socket, channel, 'fetched_bytecode', { fetched_bytecode: '0x0123' });

    const request = await page.waitForRequest(addressApiUrl);

    expect(request).toBeTruthy();
  });
});

test('verified proxy contract with token', async({ render, page, mockEnvs, mockApiResponse }) => {
  const address = { ...addressMock.contract, token: tokenInfo };

  await mockEnvs([
    [ 'NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED', 'true' ],
  ]);
  await mockApiResponse('core:address', address, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_counters', addressCountersMock.forContract, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:contract_solidity_scan_report', solidityscanReportMock.solidityscanReportGreat, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('metadata:info', generateAddressMetadataInfo(addressParamMock.hash, nameTag), { queryParams: addressMetadataQueryParams });
  await mockApiResponse('metadata:address_submit', null as never);
  await mockApiResponse('bens:addresses_lookup', { items: [], next_page_params: undefined }, { queryParams: ensLookupQueryParams });

  const component = await render(<Address/>, { hooksConfig });
  await expect(component.getByLabel('SolidityScan score')).toBeVisible();

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('degradation view', async({ render, page, mockRpcResponse, mockApiResponse }) => {
  await mockApiResponse('core:address', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_tabs_counters', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_txs', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:stats', null as never, { status: 500 });
  await mockApiResponse('metadata:info', null as never, { queryParams: addressMetadataQueryParams, status: 500 });
  await mockApiResponse('bens:addresses_lookup', null as never, { queryParams: ensLookupQueryParams, status: 500 });
  await mockRpcResponse([
    {
      Method: 'eth_getBalance',
      Parameters: [ addressParamMock.hash, 'latest' ],
      ReturnType: numberToHex(1234567890123456),
    },
    // the node is down for the tx count too, which keeps the row in its loading state like the balance-only run
    {
      Method: 'eth_getTransactionCount',
      Parameters: [ addressParamMock.hash, 'latest' ],
      ReturnType: numberToHex(0),
      status: 500,
    },
  ]);

  const component = await render(<Address/>, { hooksConfig });
  await page.waitForResponse(config.chain.rpcUrls[0]);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
