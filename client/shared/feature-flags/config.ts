// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const title = 'GrowthBook feature flagging and A/B testing';

const config: Feature<{ clientKey: string }> = (() => {
  if (!app.isPrivateMode && clientKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      clientKey,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
