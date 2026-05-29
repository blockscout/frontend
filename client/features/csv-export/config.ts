// SPDX-License-Identifier: LicenseRef-Blockscout

import * as services from 'client/config/services';
import type { Feature } from 'client/config/utils/features';

const title = 'Export data to CSV file';

const config: Feature<{ reCaptcha: { siteKey: string } }> = (() => {
  if (services.reCaptcha.siteKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      reCaptcha: {
        siteKey: services.reCaptcha.siteKey,
      },
    });
  }
  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
