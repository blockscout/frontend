// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'Cross-chain transactions';

const config: Feature<{}> = (() => {
  if (getEnvValue('NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED') === 'true' && apis.interchainIndexer) {
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
