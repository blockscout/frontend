import type { TestFixture, Page } from '@playwright/test';

import type { WalletProvider } from 'src/features/web3-wallet/types/wallet-provider';

export type InjectMetaMaskProvider = () => Promise<void>;

const fixture: TestFixture<InjectMetaMaskProvider, { page: Page }> = async({ page }, use) => {
  await use(async() => {
    await page.evaluate(() => {
      window.ethereum = {
        isMetaMask: true,
        _events: {},
        _state: {},
      } as WalletProvider;
    });
  });
};

export default fixture;
