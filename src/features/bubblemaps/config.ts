// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Bubblemaps';

const chainSlug = getEnvValue('NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG');
const partnerId = getEnvValue('NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID');

const config: Feature<{ chainSlug: string; partnerId: string }> = (() => {
  if (!app.isPrivateMode && chainSlug && partnerId) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainSlug,
      partnerId,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
