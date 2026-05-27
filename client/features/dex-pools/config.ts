// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const dexPoolsEnabled = getEnvValue('NEXT_PUBLIC_DEX_POOLS_ENABLED') === 'true';

const title = 'DEX Pools';

const config: Feature<{ }> = (() => {
  if (apis.contractInfo && dexPoolsEnabled) {
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
