// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from './utils/envs';

export default Object.freeze({
  reCaptchaV2: {
    siteKey: getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY'),
  },
});
