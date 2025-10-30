import type { WalletType, WalletInfo } from 'types/client/wallets';

export const WALLETS_INFO: Record<Exclude<WalletType, 'none'>, WalletInfo> = {
  metamask: {
    name: 'MetaMask',
    icon: 'wallets/metamask',
    color: '#FF8D5D',
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: 'wallets/coinbase',
    color: '#0052FF',
  },
  token_pocket: {
    name: 'TokenPocket',
    icon: 'wallets/token-pocket',
    color: '#0500FF',
  },
};
