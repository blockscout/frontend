// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const isDisabled = getEnvValue('NEXT_PUBLIC_ADVANCED_FILTER_ENABLED') === 'false';

const title = 'Advanced filter';

const config: Feature<{}> = (() => {
  if (!isDisabled) {
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
