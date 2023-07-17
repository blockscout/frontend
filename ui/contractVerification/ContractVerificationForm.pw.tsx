import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { SmartContractVerificationConfig } from 'types/api/contract';

import * as socketServer from 'playwright/fixtures/socketServer';
import TestApp from 'playwright/TestApp';

import ContractVerificationForm from './ContractVerificationForm';

const hooksConfig = {
  router: {
    query: {},
  },
};

const hash = '0x2F99338637F027CFB7494E46B49987457beCC6E3';
const formConfig: SmartContractVerificationConfig = {
  is_rust_verifier_microservice_enabled: true,
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
    'flattened-code',
    'standard-input',
    'sourcify',
    'multi-part',
    'vyper-code',
    'vyper-multi-part',
    'vyper-standard-input',
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
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('solidity');
  await page.getByRole('button', { name: /flattened source code/i }).click();
  await page.getByText(/add contract libraries/i).click();
  await page.locator('button[aria-label="add"]').click();

  await expect(component).toHaveScreenshot();
});

test('standard input json method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('solidity');
  await page.getByRole('button', { name: /standard json input/i }).click();

  await expect(component).toHaveScreenshot();
});

test.describe('sourcify', () => {
  const testWithSocket = test.extend<socketServer.SocketServerFixture>({
    createSocket: socketServer.createSocket,
  });
  testWithSocket.describe.configure({ mode: 'serial', timeout: 20_000 });

  testWithSocket('with multiple contracts', async({ mount, page, createSocket }) => {
    const component = await mount(
      <TestApp withSocket>
        <ContractVerificationForm config={ formConfig } hash={ hash }/>
      </TestApp>,
      { hooksConfig },
    );

    await component.getByLabel(/verification method/i).focus();
    await component.getByLabel(/verification method/i).type('solidity');
    await page.getByRole('button', { name: /sourcify/i }).click();

    await page.getByText(/drop files/i).click();
    await page.locator('input[name="sources"]').setInputFiles([
      './playwright/mocks/file_mock_1.json',
      './playwright/mocks/file_mock_2.json',
      './playwright/mocks/file_mock_with_very_long_name.json',
    ]);

    await expect(component).toHaveScreenshot();

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ hash.toLowerCase() }`);

    await page.getByRole('button', { name: /verify/i }).click();

    socketServer.sendMessage(socket, channel, 'verification_result', {
      status: 'error',
      errors: {
        // eslint-disable-next-line max-len
        files: [ 'Detected 5 contracts (ERC20, IERC20, IERC20Metadata, Context, MockERC20), but can only verify 1 at a time. Please choose a main contract and click Verify again.' ],
      },
    });

    await component.getByLabel(/contract name/i).focus();
    await component.getByLabel(/contract name/i).type('e');
    const contractNameOption = page.getByRole('button', { name: /MockERC20/i });

    await expect(contractNameOption).toBeVisible();

    await expect(component).toHaveScreenshot();
  });
});

test('multi-part files method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('solidity');
  await page.getByRole('button', { name: /multi-part files/i }).click();

  await expect(component).toHaveScreenshot();
});

test('vyper contract method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('vyper');
  await page.getByRole('button', { name: /contract/i }).click();

  await expect(component).toHaveScreenshot();
});

test('vyper multi-part method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('vyper');
  await page.getByRole('button', { name: /multi-part files/i }).click();

  await expect(component).toHaveScreenshot();
});

test('vyper vyper-standard-input method', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ContractVerificationForm config={ formConfig } hash={ hash }/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByLabel(/verification method/i).focus();
  await component.getByLabel(/verification method/i).type('vyper');
  await page.getByRole('button', { name: /standard json input/i }).click();

  await expect(component).toHaveScreenshot();
});
