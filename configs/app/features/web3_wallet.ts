import type { WalletType } from 'types/client/wallets';

import { getEnvValue } from '../utils';

const defaultWallet = ((): WalletType => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_WEB3_DEFAULT_WALLET);
  const SUPPORTED_WALLETS: Array<WalletType> = [
    'metamask',
    'coinbase',
  ];

  return envValue && SUPPORTED_WALLETS.includes(envValue) ? envValue as WalletType : 'metamask';
})();

export default Object.freeze({
  title: 'Web3 wallet integration (add token / network to wallet',
  isEnabled: defaultWallet !== 'none',
  defaultWallet,
  addToken: {
    isDisabled: getEnvValue(process.env.NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET) === 'true',
  },
  addNetwork: {},
});
