// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';

const config = Object.freeze({
  siteKey: !app.isPrivateMode ? getEnvValue('NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY') : undefined,
});

export default config;
