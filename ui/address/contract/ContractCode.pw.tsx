import React from 'react';

import * as addressMock from 'mocks/address/address';
import { contractAudits } from 'mocks/contract/audits';
import * as contractMock from 'mocks/contract/info';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';

import ContractCode from './specs/ContractCode';

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

test('full view +@mobile +@dark-mode', async({ render, mockApiResponse, createSocket }) => {
  await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.hash } });
  await mockApiResponse('contract', contractMock.withChangedByteCode, { pathParams: { hash: addressMock.contract.implementations?.[0].address as string } });

  const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });
  await createSocket();

  await expect(component).toHaveScreenshot();
});

test('verified with changed byte code socket', async({ render, mockApiResponse, createSocket }) => {
  await mockApiResponse('contract', contractMock.verified, { pathParams: { hash: addressMock.contract.hash } });

  const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });
  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());
  socketServer.sendMessage(socket, channel, 'changed_bytecode', {});

  await expect(component).toHaveScreenshot();
});

test('verified via lookup in eth_bytecode_db', async({ render, mockApiResponse, createSocket, page }) => {
  const contractApiUrl = await mockApiResponse('contract', contractMock.nonVerified, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  const socket = await createSocket();
  const channel = await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());
  await page.waitForResponse(contractApiUrl);
  socketServer.sendMessage(socket, channel, 'smart_contract_was_verified', {});
  const request = await page.waitForRequest(addressApiUrl);

  expect(request).toBeTruthy();
});

test('verified with multiple sources', async({ render, page, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.withMultiplePaths, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  const section = page.locator('section', { hasText: 'Contract source code' });
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'View external libraries' }).click();
  await expect(section).toHaveScreenshot();

  await page.getByRole('button', { name: 'Open source code in IDE' }).click();
  await expect(section).toHaveScreenshot();
});

test('verified via sourcify', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('contract', contractMock.verifiedViaSourcify, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 110 } });
});

test('verified via eth bytecode db', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('contract', contractMock.verifiedViaEthBytecodeDb, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 110 } });
});

test('self destructed', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('contract', contractMock.selfDestructed, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  const section = page.locator('section', { hasText: 'Contract creation code' });
  await expect(section).toHaveScreenshot();
});

test('with twin address alert +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.withTwinAddress, { pathParams: { hash: addressMock.contract.hash } });
  const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('with proxy address alert +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.withProxyAddress, { pathParams: { hash: addressMock.contract.hash } });
  const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(component.getByRole('alert')).toHaveScreenshot();
});

test('with certified icon +@mobile', async({ render, mockApiResponse, page }) => {
  await mockApiResponse('contract', contractMock.certified, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig });

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 120 } });
});

test('non verified', async({ render, mockApiResponse }) => {
  await mockApiResponse('contract', contractMock.nonVerified, { pathParams: { hash: addressMock.contract.hash } });
  const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(component).toHaveScreenshot();
});

test('zkSync contract', async({ render, mockApiResponse, page, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.zkSyncRollup);
  await mockApiResponse('contract', contractMock.zkSync, { pathParams: { hash: addressMock.contract.hash } });
  await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test.describe('with audits feature', () => {

  test.beforeEach(async({ mockEnvs }) => {
    await mockEnvs(ENVS_MAP.hasContractAuditReports);
  });

  test('no audits', async({ render, mockApiResponse }) => {
    await mockApiResponse('contract', contractMock.verified, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse('contract_security_audits', { items: [] }, { pathParams: { hash: addressMock.contract.hash } });
    const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

    await expect(component).toHaveScreenshot();
  });

  test('has audits', async({ render, mockApiResponse }) => {
    await mockApiResponse('contract', contractMock.verified, { pathParams: { hash: addressMock.contract.hash } });
    await mockApiResponse('contract_security_audits', contractAudits, { pathParams: { hash: addressMock.contract.hash } });
    const component = await render(<ContractCode/>, { hooksConfig }, { withSocket: true });

    await expect(component).toHaveScreenshot();
  });
});
