// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Config } from 'mixpanel-browser';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import usercentrics from 'src/services/usercentrics/config';

const projectToken = getEnvValue('NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN');
const configOverrides = (() => {
  const value = getEnvValue('NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES');
  if (!value) {
    return;
  }

  return parseEnvJson<Partial<Config>>(value) || undefined;
})();

const config = Object.freeze({
  projectToken: !app.isPrivateMode && !(usercentrics && !usercentrics.consent?.mixpanel) ? projectToken : undefined,
  configOverrides,
});

export default config;
