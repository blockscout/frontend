// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Config } from 'mixpanel-browser';

import app from 'client/config/app';
import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const projectToken = getEnvValue('NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN');
const configOverrides = (() => {
  const value = getEnvValue('NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES');
  if (!value) {
    return;
  }

  return parseEnvJson<Partial<Config>>(value) || undefined;
})();

const title = 'Mixpanel analytics';

const config: Feature<{ projectToken: string; configOverrides?: Partial<Config> }> = (() => {
  if (!app.isPrivateMode && projectToken) {
    return Object.freeze({
      title,
      isEnabled: true,
      projectToken,
      configOverrides,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
