import type { WalletType, WalletInfo } from 'types/client/wallets';

export const WALLETS_INFO: Record<Exclude<WalletType, 'none'>, WalletInfo> = {
  metamask: {
    name: 'MetaMask',
    icon: 'wallets/metamask',
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: 'wallets/coinbase',
  },
  token_pocket: {
    name: 'TokenPocket',
    icon: 'wallets/token-pocket',
  },
};
