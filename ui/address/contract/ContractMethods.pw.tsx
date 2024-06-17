import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as methodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractMethods from './ContractMethods';

const addressHash = addressMock.hash;

test('read methods', async({ render, mockContractReadResponse }) => {
  test.slow();

  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_custom_methods' },
    },
  };

  await mockContractReadResponse({
    abiItem: methodsMock.read[1],
    address: addressHash,
    result: [ 'USDC' ],
  });

  const component = await render(<ContractMethods abi={ methodsMock.read } type="read"/>, { hooksConfig });
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

  const component = await render(<ContractMethods abi={ methodsMock.write } type="write"/>, { hooksConfig });
  await component.getByText(/expand all/i).click();

  await expect(component).toHaveScreenshot();
});
