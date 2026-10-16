// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AlternativeExplorer } from './types/client';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Alternative explorers';

const config: Feature<{ items: Array<AlternativeExplorer> }> = (() => {
  const items = parseEnvJson<Array<AlternativeExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS'));

  if (items && items.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      items,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
