import type { WalletType, WalletInfo } from 'types/client/wallets';

import coinbaseIcon from 'icons/wallets/coinbase.svg';
import metamaskIcon from 'icons/wallets/metamask.svg';

export const WALLETS_INFO: Record<WalletType, WalletInfo> = {
  metamask: {
    add_token_text: 'Add token to MetaMask',
    add_network_text: 'Add network to MetaMask',
    icon: metamaskIcon,
  },
  coinbase: {
    add_token_text: 'Add token to Coinbase Wallet',
    add_network_text: 'Add network to Coinbase Wallet',
    icon: coinbaseIcon,
  },
};
