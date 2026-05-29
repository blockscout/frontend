// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Config } from 'mixpanel-browser';

import app from 'client/config/app';
import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';

const projectToken = getEnvValue('NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN');
const configOverrides = (() => {
  const value = getEnvValue('NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES');
  if (!value) {
    return;
  }

  return parseEnvJson<Partial<Config>>(value) || undefined;
})();

const config = Object.freeze({
  projectToken: !app.isPrivateMode ? projectToken : undefined,
  configOverrides,
});

export default config;
