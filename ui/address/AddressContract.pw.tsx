import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as contractInfoMock from 'mocks/contract/info';
import * as contractMethodsMock from 'mocks/contract/methods';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';

import AddressContract from './AddressContract.pwstory';

const hash = addressMock.contract.hash;

test.beforeEach(async({ mockApiResponse }) => {
  await mockApiResponse('general:address', addressMock.contract, { pathParams: { hash } });
  await mockApiResponse(
    'general:contract',
    { ...contractInfoMock.verified, abi: [ ...contractMethodsMock.read, ...contractMethodsMock.write ] },
    { pathParams: { hash } },
  );
});

test.describe('ABI functionality', () => {
  test('read', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash, tab: 'read_contract' },
      },
    };
    const component = await render(<AddressContract/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());

    await expect(component.getByRole('button', { name: 'Connect wallet' })).toBeVisible();
    await component.getByText('FLASHLOAN_PREMIUM_TOTAL').click();
    await expect(component.getByLabel('FLASHLOAN_PREMIUM_TOTAL').getByRole('button', { name: 'Read' })).toBeVisible();
  });

  test('read, no wallet client', async({ render, createSocket, mockEnvs }) => {
    const hooksConfig = {
      router: {
        query: { hash, tab: 'read_contract' },
      },
    };
    await mockEnvs(ENVS_MAP.noWalletClient);
    const component = await render(<AddressContract/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());

    await expect(component.getByRole('button', { name: 'Connect wallet' })).toBeHidden();
    await component.getByText('FLASHLOAN_PREMIUM_TOTAL').click();
    await expect(component.getByLabel('FLASHLOAN_PREMIUM_TOTAL').getByRole('button', { name: 'Read' })).toBeVisible();
  });

  test('write', async({ render, createSocket }) => {
    const hooksConfig = {
      router: {
        query: { hash, tab: 'write_contract' },
      },
    };
    const component = await render(<AddressContract/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());

    await expect(component.getByRole('button', { name: 'Connect wallet' })).toBeVisible();
    await component.getByText('setReserveInterestRateStrategyAddress').click();
    await expect(component.getByLabel('9.').getByRole('button', { name: 'Simulate' })).toBeEnabled();
    await expect(component.getByLabel('9.').getByRole('button', { name: 'Write' })).toBeEnabled();

    await component.getByText('pause').click();
    await expect(component.getByLabel('5.').getByRole('button', { name: 'Simulate' })).toBeHidden();
    await expect(component.getByLabel('5.').getByRole('button', { name: 'Write' })).toBeEnabled();
  });

  test('write, no wallet client', async({ render, createSocket, mockEnvs }) => {
    const hooksConfig = {
      router: {
        query: { hash, tab: 'write_contract' },
      },
    };
    await mockEnvs(ENVS_MAP.noWalletClient);

    const component = await render(<AddressContract/>, { hooksConfig }, { withSocket: true });
    const socket = await createSocket();
    await socketServer.joinChannel(socket, 'addresses:' + addressMock.contract.hash.toLowerCase());

    await expect(component.getByRole('button', { name: 'Connect wallet' })).toBeHidden();
    await component.getByText('setReserveInterestRateStrategyAddress').click();
    await expect(component.getByLabel('9.').getByRole('button', { name: 'Simulate' })).toBeEnabled();
    await expect(component.getByLabel('9.').getByRole('button', { name: 'Write' })).toBeDisabled();

    await component.getByText('pause').click();
    await expect(component.getByLabel('5.').getByRole('button', { name: 'Simulate' })).toBeHidden();
    await expect(component.getByLabel('5.').getByRole('button', { name: 'Write' })).toBeDisabled();
  });
});
