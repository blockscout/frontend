import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { SmartContractVerificationConfig } from 'types/api/contract';

import TestApp from 'playwright/TestApp';

import ContractVerificationForm from './ContractVerificationForm';

const hooksConfig = {
  router: {
    query: {},
  },
};

const formConfig: SmartContractVerificationConfig = {
  solidity_compiler_versions: [
    'v0.8.17+commit.8df45f5f',
    'v0.8.16+commit.07a7930e',
    'v0.8.15+commit.e14f2714',
    'v0.8.18-nightly.2022.11.23+commit.eb2f874e',
    'v0.8.17-nightly.2022.8.24+commit.22a0c46e',
    'v0.8.16-nightly.2022.7.6+commit.b6f11b33',
  ],
  solidity_evm_versions: [
    'default',
    'london',
    'berlin',
  ],
  verification_options: [
    'flattened_code',
    'standard_input',
    'sourcify',
    'multi_part',
    'vyper_multi_part',
  ],
  vyper_compiler_versions: [
    'v0.3.7+commit.6020b8bb',
    'v0.3.1+commit.0463ea4c',
    'v0.3.0+commit.8a23feb',
    'v0.2.16+commit.59e1bdd',
    'v0.2.3+commit.006968f',
    'v0.2.2+commit.337c2ef',
    'v0.1.0-beta.17+commit.0671b7b',
  ],
  vyper_evm_versions: [
    'byzantium',
    'constantinople',
    'petersburg',
    'istanbul',
  ],
};

test('flatten source code method +@dark-mode +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig }/>
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
      <ContractVerificationForm config={ formConfig }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/via standard/i).click();

  await expect(component).toHaveScreenshot();
});

test('sourcify method +@dark-mode +@mobile', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig }/>
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
      <ContractVerificationForm config={ formConfig }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/via multi-part files/i).click();

  await expect(component).toHaveScreenshot();
});

test('vyper contract method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText(/vyper contract/i).click();

  await expect(component).toHaveScreenshot();
});
