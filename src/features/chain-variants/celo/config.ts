// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Celo chain';

const config: Feature<{ }> = (() => {

  if (getEnvValue('NEXT_PUBLIC_CELO_ENABLED') === 'true') {
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
