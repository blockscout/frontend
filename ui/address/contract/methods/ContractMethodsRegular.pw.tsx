import React from 'react';

import type { SmartContractMethod } from './types';

import * as addressMock from 'mocks/address/address';
import * as methodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import ContractMethodsRegular from './ContractMethodsRegular';

const addressHash = addressMock.hash;

test('can read method', async({ render, mockContractReadResponse }) => {
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

  const component = await render(<ContractMethodsRegular abi={ methodsMock.read }/>, { hooksConfig });
  await component.getByText(/expand all/i).click();

  await expect(component.getByText('USDC')).toBeVisible({ timeout: 20_000 });
});

test('all methods +@dark-mode', async({ render }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressHash, tab: 'read_write_contract' },
    },
  };

  const abi: Array<SmartContractMethod> = [ ...methodsMock.read, ...methodsMock.write ];
  const component = await render(<ContractMethodsRegular abi={ abi }/>, { hooksConfig });
  await component.getByText(/expand all/i).click();
  await expect(component.getByText('HTTP request failed')).toBeVisible();

  await expect(component).toHaveScreenshot();
});

test.describe('all methods', () => {
  test.use({ viewport: pwConfig.viewport.mobile });

  test('mobile', async({ render }) => {
    test.slow();

    const hooksConfig = {
      router: {
        query: { hash: addressHash, tab: 'read_write_contract' },
      },
    };

    const abi: Array<SmartContractMethod> = [ ...methodsMock.read, ...methodsMock.write ];
    const component = await render(<ContractMethodsRegular abi={ abi }/>, { hooksConfig });
    await component.getByText(/expand all/i).click();
    // await expect(component.getByText('HTTP request failed')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });
});
