export const SUPPORTED_WALLETS = [
  'metamask' as const,
  'coinbase' as const,
];

import coinbaseIcon from 'icons/wallets/coinbase.svg';
import metamaskIcon from 'icons/wallets/metamask.svg';

export const WALLETS_INFO = {
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
