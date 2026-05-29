// SPDX-License-Identifier: LicenseRef-Blockscout

import multichain from 'src/features/multichain/config';

import apis from 'src/config/apis';
import type { Feature } from 'src/config/utils/features';

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
