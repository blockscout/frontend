import React from 'react';

import * as addressMock from 'src/slices/address/mocks/address';
import * as contractMock from 'src/slices/contract/mocks/info';

import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import ContractDetails from './ContractCode.pwstory';

const hooksConfig = {
  router: {
    query: { hash: addressMock.contract.hash, tab: 'contract_code' },
  },
};

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test.beforeEach(async({ mockApiResponse, page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/**', (route) => {
    route.abort();
  });
  await mockApiResponse('core:address', addressMock.contract, { pathParams: { hash: addressMock.contract.hash } });
});

test.describe('full view', () => {
  test.beforeEach(async({ mockApiResponse }) => {
    await mockApiResponse('core:contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse(
      'core:contract',
      contractMock.withChangedByteCode,
      { pathParams: { hash: addressMock.contract.implementations?.[0].address_hash as string } },
    );
  });

  test('source code +@dark-mode', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_source_code' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);
    await expect(component).toHaveScreenshot();
  });

  test('compiler', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_compiler' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);
    await expect(component).toHaveScreenshot();
  });

  test('abi', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_abi' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);
    await expect(component).toHaveScreenshot();
  });

  test('bytecode', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash: addressMock.contract.hash, tab: 'contract_bytecode' },
      },
    };
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);
    await expect(component).toHaveScreenshot();
  });
});

test.describe('mobile view', () => {
  test.use({ viewport: pwConfig.viewport.mobile });

  test('source code', async({ render, createSocket, mockApiResponse }) => {
    await mockApiResponse('core:contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse(
      'core:contract',
      contractMock.withChangedByteCode,
      { pathParams: { hash: addressMock.contract.implementations?.[0].address_hash as string } },
    );
    const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);
    await expect(component).toHaveScreenshot();
  });
});

test('verified with multiple sources', async({ render, page, mockApiResponse, createSocket }) => {
  await mockApiResponse('core:contract', contractMock.withMultiplePaths, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);

  const section = page.locator('section', { hasText: 'Contract source code' });
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'View external libraries' }).click();
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'Open source code in IDE' }).click();
  await expect(section).toHaveScreenshot();
});

test('self destructed', async({ render, mockApiResponse, page, createSocket }) => {
  const hooksConfig = {
    router: {
      query: { hash: addressMock.contract.hash, tab: 'contract_bytecode' },
    },
  };
  await mockApiResponse('core:contract', contractMock.selfDestructed, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);

  const section = page.locator('section', { hasText: 'Contract creation code' });
  await expect(section).toHaveScreenshot();
});

test('non verified', async({ render, mockApiResponse, createSocket }) => {
  await mockApiResponse('core:address', { ...addressMock.contract, name: null }, { pathParams: { hash: addressMock.contract.hash } });
  await mockApiResponse('core:contract', contractMock.nonVerified, { pathParams: { hash: addressMock.contract.hash } });
  const component = await render(<ContractDetails/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  await socketServer.joinChannel(socket, `addresses:${ addressMock.contract.hash.toLowerCase() }`);

  await expect(component).toHaveScreenshot();
});
