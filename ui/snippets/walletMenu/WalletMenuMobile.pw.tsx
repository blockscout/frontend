import React from 'react';

import type * as bens from '@blockscout/bens-types';

import config from 'configs/app';
import * as addressMock from 'mocks/address/address';
import * as domainMock from 'mocks/ens/domain';
import { test, expect, devices } from 'playwright/lib';

import { WalletMenuMobile } from './WalletMenuMobile';

const props = {
  isWalletConnected: false,
  address: '',
  connect: () => {},
  disconnect: () => {},
  isModalOpening: false,
  isModalOpen: false,
  openModal: () => {},
};

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('wallet is not connected +@dark-mode', async({ page, render }) => {
  await render(<WalletMenuMobile { ...props }/>);
  await expect(page).toHaveScreenshot();
});

test('wallet is loading', async({ page, render }) => {
  await render(<WalletMenuMobile { ...props } isModalOpen/>);
  await expect(page).toHaveScreenshot();
});

test('wallet connected +@dark-mode', async({ page, render, mockApiResponse }) => {
  await mockApiResponse(
    'address_domain',
    { domain: undefined, resolved_domains_count: 0 } as bens.GetAddressResponse,
    { pathParams: { address: addressMock.hash, chainId: config.chain.id } },
  );

  const component = await render(<WalletMenuMobile { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot();
});

test('wallet with ENS connected', async({ page, render, mockApiResponse }) => {
  await mockApiResponse(
    'address_domain',
    { domain: domainMock.ensDomainB, resolved_domains_count: 1 } as bens.GetAddressResponse,
    { pathParams: { address: addressMock.hash, chainId: config.chain.id } },
  );

  const component = await render(<WalletMenuMobile { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot();
});
