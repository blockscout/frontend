// running this test together with other causing JS memory leak
// I was not able to figure out the exact reason, so for now it is skipped
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as contractMock from 'mocks/contract/info';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ContractCode from './ContractCode';

const addressHash = 'hash';
const CONTRACT_API_URL = buildApiUrl('contract', { id: addressHash });
const hooksConfig = {
  router: {
    query: { id: addressHash },
  },
};

test('verified with changed byte code +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withChangedByteCode),
  }));

  const component = await mount(
    <TestApp>
      <ContractCode/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('verified with multiple sources', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.withMultiplePaths),
  }));

  await mount(
    <TestApp>
      <ContractCode/>
    </TestApp>,
    { hooksConfig },
  );

  const section = page.locator('section', { hasText: 'Contract source code' });

  await expect(section).toHaveScreenshot();
});

test('verified via sourcify', async({ mount, page }) => {
  await page.route(CONTRACT_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMock.verifiedViaSourcify),
  }));

  await mount(
    <TestApp>
      <ContractCode/>
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

  await mount(
    <TestApp>
      <ContractCode/>
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

  const component = await mount(
    <TestApp>
      <ContractCode/>
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

  const component = await mount(
    <TestApp>
      <ContractCode/>
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

  const component = await mount(
    <TestApp>
      <ContractCode/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
