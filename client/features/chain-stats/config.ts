// SPDX-License-Identifier: LicenseRef-Blockscout

import multichain from 'client/features/multichain/config';

import apis from 'client/config/apis';
import type { Feature } from 'client/config/utils/features';

const title = 'Blockchain statistics';

const config: Feature<{}> = (() => {
  if (apis.stats || multichain.isEnabled) {
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
