import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import ContractVerificationForm from './ContractVerificationForm';

const hooksConfig = {
  router: {
    query: {},
  },
};

test('flatten source code method +@dark-mode +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/flattened source code/i).click();
  await page.getByText(/optimization enabled/i).click();
  await page.getByText(/add contract libraries/i).click();
  await page.locator('button[aria-label="add"]').click();

  await expect(component).toHaveScreenshot();
});

test('standard input json method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/via standard/i).click();

  await expect(component).toHaveScreenshot();
});

test('sourcify method +@dark-mode +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/via sourcify/i).click();
  await page.getByText(/upload files/i).click();
  await page.locator('input[name="sources"]').setInputFiles([
    './playwright/mocks/file_mock_1.json',
    './playwright/mocks/file_mock_2.json',
    './playwright/mocks/file_mock_with_very_long_name.json',
  ]);

  await expect(component).toHaveScreenshot();
});

test('multi-part files method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/via multi-part files/i).click();

  await expect(component).toHaveScreenshot();
});

test('vyper contract method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/vyper contract/i).click();

  await expect(component).toHaveScreenshot();
});
