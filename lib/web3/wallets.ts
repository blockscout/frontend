import type { WalletType, WalletInfo } from 'types/client/wallets';

import coinbaseIcon from 'icons/wallets/coinbase.svg';
import metamaskIcon from 'icons/wallets/metamask.svg';

export const WALLETS_INFO: Record<WalletType, WalletInfo> = {
  metamask: {
    name: 'MetaMask',
    icon: metamaskIcon,
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: coinbaseIcon,
  },
};
