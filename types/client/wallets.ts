import type { providers } from 'ethers';

import type { ArrayElement } from 'types/utils';

import type { SUPPORTED_WALLETS } from 'lib/web3/wallets';

export type WalletType = ArrayElement<typeof SUPPORTED_WALLETS>;

export interface ExternalProvider extends providers.ExternalProvider {
  isCoinbaseWallet?: boolean;
  // have to patch ethers here, since params could be not only an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: (request: { method: string; params?: any }) => Promise<any>;
}
