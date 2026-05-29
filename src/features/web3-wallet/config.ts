// SPDX-License-Identifier: LicenseRef-Blockscout

import { SUPPORTED_WALLETS } from 'src/features/web3-wallet/types/config';
import type { WalletType } from 'src/features/web3-wallet/types/config';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const wallets = ((): Array<WalletType> | undefined => {
  const envValue = getEnvValue('NEXT_PUBLIC_WEB3_WALLETS');
  if (envValue === 'none') {
    return;
  }

  const wallets = parseEnvJson<Array<WalletType>>(envValue)?.filter((type) => SUPPORTED_WALLETS.includes(type));

  if (!wallets || wallets.length === 0) {
    return [ 'metamask', 'rabby', 'coinbase', 'trust', 'okx', 'token_pocket' ];
  }

  return wallets;
})();

const title = 'Web3 wallet integration (add token or network to the wallet)';

const config: Feature<{ wallets: Array<WalletType>; addToken: { isDisabled: boolean } }> = (() => {
  if (!app.isPrivateMode && wallets && wallets.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      wallets,
      addToken: {
        isDisabled: getEnvValue('NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET') === 'true',
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
