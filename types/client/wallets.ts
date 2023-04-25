import type { providers } from 'ethers';

export type WalletType = 'metamask' | 'coinbase';

export interface WalletInfo {
  add_token_text: string;
  add_network_text: string;
  icon: React.ElementType;
}

export interface ExternalProvider extends providers.ExternalProvider {
  isCoinbaseWallet?: boolean;
  // have to patch ethers here, since params could be not only an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: (request: { method: string; params?: any }) => Promise<any>;
}
