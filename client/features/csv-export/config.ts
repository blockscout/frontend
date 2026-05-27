// SPDX-License-Identifier: LicenseRef-Blockscout

import services from 'client/config/services';
import type { Feature } from 'client/config/utils/features';

const title = 'Export data to CSV file';

const config: Feature<{ reCaptcha: { siteKey: string } }> = (() => {
  if (services.reCaptchaV2.siteKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      reCaptcha: {
        siteKey: services.reCaptchaV2.siteKey,
      },
    });
  }
  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
