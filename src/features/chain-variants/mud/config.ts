// SPDX-License-Identifier: LicenseRef-Blockscout

import rollup from 'src/features/rollup/common/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'MUD framework';

const config: Feature<{ isEnabled: true }> = (() => {
  if (rollup.isEnabled && rollup.type === 'optimistic' && getEnvValue('NEXT_PUBLIC_HAS_MUD_FRAMEWORK') === 'true') {
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
