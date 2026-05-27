// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

import rollup from 'client/features/rollup/common/config';

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
