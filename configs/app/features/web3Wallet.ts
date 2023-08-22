import type { Feature } from './types';
import type { WalletType } from 'types/client/wallets';

import { getEnvValue, parseEnvJson } from '../utils';

const wallets = ((): Array<WalletType> | undefined => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_WEB3_WALLETS);
  if (envValue === 'none') {
    return;
  }

  const SUPPORTED_WALLETS: Array<WalletType> = [
    'metamask',
    'coinbase',
    'token_pocket',
  ];

  const wallets = parseEnvJson<Array<WalletType>>(envValue)?.filter((type) => SUPPORTED_WALLETS.includes(type));

  if (!wallets || wallets.length === 0) {
    return [ 'metamask' ];
  }

  return wallets;
})();

const title = 'Web3 wallet integration (add token or network to the wallet)';

const config: Feature<{ wallets: Array<WalletType>; addToken: { isDisabled: boolean }}> = (() => {
  if (wallets && wallets.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      wallets,
      addToken: {
        isDisabled: getEnvValue(process.env.NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET) === 'true',
      },
      addNetwork: {},
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
