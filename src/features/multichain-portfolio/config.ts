// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/api/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const isMultichainExplorer = getEnvValue('NEXT_PUBLIC_MULTICHAIN_ENABLED') === 'true';

const title = 'Multichain portfolio';

const config: Feature<{ isEnabled: true }> = (() => {
  if (apis.multichainAggregator && !isMultichainExplorer) {
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
