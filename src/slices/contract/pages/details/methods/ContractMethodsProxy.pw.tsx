import React from 'react';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as contractMock from 'src/slices/contract/mocks/info';
import * as methodsMock from 'src/slices/contract/mocks/methods';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import { test, expect } from 'playwright/lib';

import ContractMethodsProxy from './ContractMethodsProxy';

const addressHash = addressParamMock.hash;

test('with one implementation +@mobile', async({ render, mockApiResponse, mockRpcResponse, context }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_proxy' },
    },
  };
  const implementations = [
    { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
  ];
  await mockApiResponse('core:contract', { ...contractMock.verified, abi: methodsMock.read }, { pathParams: { hash: implementations[0].address_hash } });
  await context.addCookies([
    { name: cookies.NAMES.CUSTOM_RPC_URL, value: config.chain.rpcUrls[0], domain: config.app.host, path: '/' },
    { name: cookies.NAMES.CUSTOM_RPC_IN_USE, value: 'true', domain: config.app.host, path: '/' },
  ]);
  // the ping posts `params: []`, which the fixture only matches when Parameters is set; viem types eth_chainId's as undefined
  await mockRpcResponse([ { Method: 'eth_chainId', Parameters: [] as unknown as undefined, ReturnType: `0x${ Number(config.chain.id).toString(16) }` } ]);

  const component = await render(<ContractMethodsProxy implementations={ implementations } proxyType="eip1167"/>, { hooksConfig });
  await expect(component.getByRole('button', { name: 'Custom RPC: Connected' })).toBeVisible();
  await expect(component).toHaveScreenshot();
});

test('with multiple implementations +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_proxy' },
    },
  };
  const implementations = [
    { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
    { address_hash: '0xc9e91eDeA9DC16604022e4E5b437Df9c64EdB05A', name: 'Diamond' },
  ];
  await mockApiResponse('core:contract', { ...contractMock.verified, abi: methodsMock.read }, { pathParams: { hash: implementations[0].address_hash } });

  const component = await render(
    <ContractMethodsProxy
      implementations={ implementations }
      proxyType="eip1167"
      conflictingImplementations={ [
        {
          proxy_type: 'eip1167',
          implementations: [
            { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
          ],
        },
        {
          proxy_type: 'eip1167',
          implementations: [
            { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
          ],
        },
      ] }
    />, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
