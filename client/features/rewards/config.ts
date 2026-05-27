// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import app from 'client/config/app';
import type { Feature } from 'client/config/utils/features';

import account from 'client/features/account/config';
import connectWallet from 'client/features/connect-wallet/config';

const title = 'Rewards service integration';

const config: Feature<{}> = (() => {
  // @0xdeval: as of now, we won't support rewards programs with dynamic auth provider
  if (!app.isPrivateMode && apis.rewards && account.isEnabled && account.authProvider === 'auth0' && connectWallet.isEnabled) {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
