import React from 'react';

import type * as bens from '@blockscout/bens-types';

import config from 'configs/app';
import * as addressMock from 'mocks/address/address';
import * as domainMock from 'mocks/ens/domain';
import { test, expect } from 'playwright/lib';

import { WalletMenuDesktop } from './WalletMenuDesktop';

const props = {
  isWalletConnected: false,
  address: '',
  connect: () => {},
  disconnect: () => {},
  isModalOpening: false,
  isModalOpen: false,
  openModal: () => {},
};

test.use({ viewport: { width: 1440, height: 750 } }); // xl

test('wallet is not connected +@dark-mode', async({ page, render }) => {
  await render(<WalletMenuDesktop { ...props }/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 50 } });
});

test('wallet is not connected (home page) +@dark-mode', async({ page, render }) => {
  await render(<WalletMenuDesktop { ...props } isHomePage/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 50 } });
});

test('wallet is loading', async({ page, render }) => {
  await render(<WalletMenuDesktop { ...props } isModalOpen/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 50 } });
});

test('wallet connected +@dark-mode', async({ page, render, mockApiResponse }) => {
  await mockApiResponse(
    'address_domain',
    { domain: undefined, resolved_domains_count: 0 } as bens.GetAddressResponse,
    { pathParams: { address: addressMock.hash, chainId: config.chain.id } },
  );

  const component = await render(<WalletMenuDesktop { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});

test('wallet connected (home page) +@dark-mode', async({ page, render }) => {
  const component = await render(<WalletMenuDesktop { ...props } isHomePage isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});

test('wallet with ENS connected', async({ page, render, mockApiResponse }) => {
  await mockApiResponse(
    'address_domain',
    { domain: domainMock.ensDomainB, resolved_domains_count: 1 } as bens.GetAddressResponse,
    { pathParams: { address: addressMock.hash, chainId: config.chain.id } },
  );

  const component = await render(<WalletMenuDesktop { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});
