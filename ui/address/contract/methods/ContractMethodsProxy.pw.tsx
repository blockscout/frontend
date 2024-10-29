import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as contractMock from 'mocks/contract/info';
import * as methodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractMethodsProxy from './ContractMethodsProxy';

const addressHash = addressMock.hash;

test('with one implementation +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_proxy' },
    },
  };
  const implementations = [
    { address: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
  ];
  await mockApiResponse('contract', { ...contractMock.verified, abi: methodsMock.read }, { pathParams: { hash: implementations[0].address } });

  const component = await render(<ContractMethodsProxy implementations={ implementations }/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('with multiple implementations +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_proxy' },
    },
  };
  const implementations = [
    { address: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
    { address: '0xc9e91eDeA9DC16604022e4E5b437Df9c64EdB05A', name: 'Diamond' },
  ];
  await mockApiResponse('contract', { ...contractMock.verified, abi: methodsMock.read }, { pathParams: { hash: implementations[0].address } });

  const component = await render(<ContractMethodsProxy implementations={ implementations }/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
