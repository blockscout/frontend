// SPDX-License-Identifier: LicenseRef-Blockscout

import account from 'src/features/account/config';
import connectWallet from 'src/features/connect-wallet/config';

import apis from 'src/config/apis';
import app from 'src/config/app';
import type { Feature } from 'src/config/utils/features';

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
