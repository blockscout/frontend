// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/api/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const isEnabled = getEnvValue('NEXT_PUBLIC_MULTICHAIN_ENABLED') === 'true';
const cluster = getEnvValue('NEXT_PUBLIC_MULTICHAIN_CLUSTER');

const title = 'Multichain explorer';

const config: Feature<{ cluster: string }> = (() => {
  if (apis.multichainAggregator && apis.multichainStats && isEnabled && cluster) {
    return Object.freeze({
      title,
      isEnabled: true,
      cluster,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
