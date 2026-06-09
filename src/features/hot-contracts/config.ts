// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Hot contracts';

const config: Feature<{ isEnabled: true }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_HOT_CONTRACTS_ENABLED') === 'true') {
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
