import React from 'react';

import type { Address } from 'types/api/address';

import * as addressMock from 'mocks/address/address';
import { test, expect } from 'playwright/lib';

import { WalletMenuDesktopComponent } from './WalletMenuDesktop';

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
  await render(<WalletMenuDesktopComponent { ...props }/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 50 } });
});

test('wallet is not connected (home page) +@dark-mode', async({ page, render }) => {
  await render(<WalletMenuDesktopComponent { ...props } isHomePage/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 50 } });
});

test('wallet connected +@dark-mode', async({ page, render, mockApiResponse }) => {
  await mockApiResponse('address', addressMock.eoa, { pathParams: { hash: addressMock.hash } });

  const component = await render(<WalletMenuDesktopComponent { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});

test('wallet connected (home page) +@dark-mode', async({ page, render, mockApiResponse }) => {
  await mockApiResponse('address', addressMock.eoa, { pathParams: { hash: addressMock.hash } });

  const component = await render(<WalletMenuDesktopComponent { ...props } isHomePage isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});

test('wallet with ENS connected', async({ page, render, mockApiResponse }) => {
  await mockApiResponse('address', { ...addressMock.eoa, ...addressMock.withEns } as Address, { pathParams: { hash: addressMock.hash } });

  const component = await render(<WalletMenuDesktopComponent { ...props } isWalletConnected address={ addressMock.hash }/>);
  await component.locator('button').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 300 } });
});
