// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const propertyId = getEnvValue('NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID');

const title = 'Google analytics';

const config: Feature<{ propertyId: string }> = (() => {
  if (!app.isPrivateMode && propertyId) {
    return Object.freeze({
      title,
      isEnabled: true,
      propertyId,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
