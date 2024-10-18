import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as contractMock from 'mocks/contract/info';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import ContractDetails from './specs/ContractDetails';

const hooksConfig = {
  router: {
    query: { hash: addressMock.contract.hash, tab: 'contract_code' },
  },
};

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

let addressApiUrl: string;

test.beforeEach(async({ mockApiResponse, page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => {
    route.abort();
  });
  addressApiUrl = await mockApiResponse('address', addressMock.contract, { pathParams: { hash: addressMock.contract.hash } });
});

test.describe('full view', () => {
  test.beforeEach(async({ mockApiResponse }) => {
    await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.implementations?.[0].address as string } });
  });

  test('source code +@dark-mode', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_source_code' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    await createSocket();
    await expect(component).toHaveScreenshot();
  });

  test('compiler', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_compiler' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    await createSocket();
    await expect(component).toHaveScreenshot();
  });

  test('abi', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_abi' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    await createSocket();
    await expect(component).toHaveScreenshot();
  });

  test('bytecode', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_bytecode' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    await createSocket();
    await expect(component).toHaveScreenshot();
  });
});

test.describe('mobile view', () => {
  test.use({ viewport: pwConfig.viewport.mobile });

  test('source code', async({ render, createSocket, mockApiResponse }) => {
    await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.implementations?.[0].address as string } });
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    await createSocket();
    await expect(component).toHaveScreenshot();
  });
});

test('verified via lookup in eth_bytecode_db', async({ render, mockApiResponse, createSocket, page }) => {
  const contractApiUrl = await mockApiResponse('contract', contractMock.nonVerified, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());
  await page.waitForResponse(contractApiUrl);
  socketServer.sendMessage(socket, channel, 'smart_contract_was_verified', {});
  const request = await page.waitForRequest(addressApiUrl);

  expect(request).toBeTruthy();
});

test('verified with multiple sources', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.withMultiplePaths, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });

  const section = page.locator('section', { hasText: 'Contract source code' });
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'View external libraries' }).click();
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'Open source code in IDE' }).click();
  await expect(section).toHaveScreenshot();
});

test('self destructed', async({ render, mockApiResponse, page }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressMock.contract.hash, tab: 'contract_bytecode' },
    },
  };
  await mockApiResponse('contract', contractMock.selfDestructed, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });

  const section = page.locator('section', { hasText: 'Contract creation code' });
  await expect(section).toHaveScreenshot();
});

test('non verified', async({ render, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.nonVerified, { pathParams: { hash: addressMock.contract.hash } });
  const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });

  await expect(component).toHaveScreenshot();
});

test('implementation info', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressMock.contract.hash, tab: 'contract_compiler' },
    },
  };

  const implementationName = addressMock.contract.implementations?.[0].name as string;
  const implementationAddress = addressMock.contract.implementations?.[0].address as string;
  const implementationContract = {
    ...contractMock.verified,
    compiler_settings: {
      evmVersion: 'london',
      libraries: {},
      metadata: {
        bytecodeHash: 'ipfs',
        useLiteralContent: false,
      },
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
  };
  await mockApiResponse('contract', contractMock.verified, { pathParams: { hash: addressMock.contract.hash } });
  await mockApiResponse('contract', implementationContract, { pathParams: { hash: implementationAddress } });

  const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
  await component.getByRole('combobox').selectOption(implementationName);

  await expect(component).toHaveScreenshot();
});
