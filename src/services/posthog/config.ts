// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import usercentrics from 'src/services/usercentrics/config';

const apiKey = getEnvValue('NEXT_PUBLIC_POSTHOG_API_KEY');
const configOverrides = (() => {
  const value = getEnvValue('NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES');
  if (!value) {
    return;
  }

  return parseEnvJson<Readonly<Record<string, unknown>>>(value) || undefined;
})();

const config = Object.freeze({
  apiKey: !app.isPrivateMode && !(usercentrics && !usercentrics.consent?.posthog) ? apiKey : undefined,
  configOverrides,
});

export default config;
