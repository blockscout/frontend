import type { Locator, Page } from '@playwright/test';

import { shortenString } from 'src/toolkit/utils/texts';

import { FAKE_WALLET, injectFakeWallet } from './fake_wallet';
import { expect, test } from './fixture';
import { fetchAppEnvs } from './instance';

const openWalletModal = async(page: Page): Promise<Locator> => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Continue with Web3 wallet' }).click();
  return page.locator('w3m-modal');
};

test('the wallet modal lists wallets', async({ page }) => {
  const walletModal = await openWalletModal(page);

  await expect(walletModal.getByRole('button', { name: /^WalletConnect/ })).toBeVisible();
  await walletModal.getByRole('button', { name: /^All Wallets/ }).click();
  await expect(walletModal.getByRole('button', { name: /^MetaMask/ }).first()).toBeVisible();
});

test('connecting the injected wallet shows its address in the header', async({ page, request }) => {
  const envs = await fetchAppEnvs(request);
  await injectFakeWallet(page, Number(envs.NEXT_PUBLIC_NETWORK_ID));

  const walletModal = await openWalletModal(page);
  await walletModal.getByRole('button', { name: `${ FAKE_WALLET.name } installed` }).click();

  await expect(page.getByRole('button', { name: shortenString(FAKE_WALLET.address) })).toBeVisible();
});
