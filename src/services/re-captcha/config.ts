// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';

const config = Object.freeze({
  siteKey: !app.isPrivateMode ? getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY') : undefined,
});

export default config;
