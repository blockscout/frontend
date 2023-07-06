import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as contractMock from 'mocks/contract/info';
import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import MockAddressPage from 'ui/address/testUtils/MockAddressPage';

import ContractCode from './ContractCode';

const addressHash = 'hash';
const CONTRACT_API_URL = buildApiUrl('contract', { hash: addressHash });
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

const test = base.extend<socketServer.SocketServerFixture>({
  createSocket: socketServer.createSocket,
});

// FIXME
// test cases which use socket cannot run in parallel since the socket server always run on the same port
test.describe.configure({ mode: 'serial' });

test('full view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withChangedByteCode),
  }));

  const ADDRESS_API_URL = buildApiUrl('address', { hash: addressHash });
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(addressMock.contract),
  }));

  const PROXY_CONTRACT_API_URL = buildApiUrl('contract', { hash: addressMock.contract.implementation_address as string });
  await page.route(PROXY_CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withChangedByteCode),
  }));

  const component = await mount(
    <TestApp>
      <MockAddressPage>
        <ContractCode addressHash={ addressHash } noSocket/>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('verified with changed byte code socket', async({ mount, page, createSocket }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.verified),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp withSocket>
      <ContractCode addressHash={ addressHash }/>
    </TestApp>,
    { hooksConfig },
  );

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'addresses:' + addressHash.toLowerCase());
  socketServer.sendMessage(socket, channel, 'changed_bytecode', {});

  await expect(component).toHaveScreenshot();
});

test('verified with multiple sources', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withMultiplePaths),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  const section = page.locator('section', { hasText: 'Contract source code' });
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'View external libraries' }).click();
  await expect(section).toHaveScreenshot();
});

test('verified via sourcify', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.verifiedViaSourcify),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 110 } });
});

test('verified via eth bytecode db', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.verifiedViaEthBytecodeDb),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 110 } });
});

test('self destructed', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.selfDestructed),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  const section = page.locator('section', { hasText: 'Contract creation code' });
  await expect(section).toHaveScreenshot();
});

test('with twin address alert +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withTwinAddress),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('with proxy address alert +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withProxyAddress),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('non verified', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.nonVerified),
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/**', (route) => route.abort());

  const component = await mount(
    <TestApp>
      <ContractCode addressHash={ addressHash } noSocket/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
