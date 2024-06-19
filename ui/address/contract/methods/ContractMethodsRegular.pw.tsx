import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as methodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractMethodsRegular from './ContractMethodsRegular';

const addressHash = addressMock.hash;

test('read methods', async({ render, mockContractReadResponse }) => {
  // for some reason it takes a long time for "wagmi" library to parse response result in the test environment
  // so I had to increase the test timeout
  test.slow();

  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_contract' },
    },
  };

  await mockContractReadResponse({
    abiItem: methodsMock.read[1],
    address: addressHash,
    result: [ 'USDC' ],
  });

  const component = await render(<ContractMethodsRegular abi={ methodsMock.read } type="read"/>, { hooksConfig });
  await component.getByText(/expand all/i).click();

  await expect(component.getByText('USDC')).toBeVisible({ timeout: 20_000 });
  await expect(component).toHaveScreenshot();
});

test('write methods +@dark-mode +@mobile', async({ render }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'write_contract' },
    },
  };

  const component = await render(<ContractMethodsRegular abi={ methodsMock.write } type="write"/>, { hooksConfig });
  await component.getByText(/expand all/i).click();

  await expect(component).toHaveScreenshot();
});
