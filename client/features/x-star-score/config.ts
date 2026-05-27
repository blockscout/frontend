// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'XStar score';
const url = getEnvValue('NEXT_PUBLIC_XSTAR_SCORE_URL');

const config: Feature<{ url: string }> = (() => {
  if (url) {
    return Object.freeze({
      title,
      url,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
