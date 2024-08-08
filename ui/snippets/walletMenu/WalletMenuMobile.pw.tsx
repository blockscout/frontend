import React from 'react';

import type { Address } from 'types/api/address';

import * as addressMock from 'mocks/address/address';
import { test, expect, devices } from 'playwright/lib';

import { WalletMenuMobileComponent } from './WalletMenuMobile';

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
  await render(<WalletMenuMobileComponent { ...props }/>);
  await expect(page).toHaveScreenshot();
});

test('wallet is loading', async({ page, render }) => {
  await render(<WalletMenuMobileComponent { ...props } isModalOpen/>);
  await expect(page).toHaveScreenshot();
});

test('wallet connected +@dark-mode', async({ page, render, mockApiResponse }) => {
  await mockApiResponse('address', addressMock.eoa, { pathParams: { hash: addressMock.hash } });

  const component = await render(<WalletMenuMobileComponent { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot();
});

test('wallet with ENS connected', async({ page, render, mockApiResponse }) => {
  await mockApiResponse('address', { ...addressMock.eoa, ...addressMock.withEns } as Address, { pathParams: { hash: addressMock.hash } });

  const component = await render(<WalletMenuMobileComponent { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot();
});
