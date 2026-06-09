// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UsercentricsConsentResult } from './types';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import { CONSENT_RESULT_ALL_ACCEPTED } from './services';

export const STORAGE_KEY = 'usercentrics-consent';

interface UsercentricsConfig {
  readonly settingsId?: string;
  readonly rulesetId?: string;
}

const consent = (() => {
  if (!isBrowser()) {
    return CONSENT_RESULT_ALL_ACCEPTED;
  }
  const consent = localStorage.getItem(STORAGE_KEY);
  if (!consent) {
    return;
  }
  try {
    return JSON.parse(consent) as UsercentricsConsentResult;
  } catch {
    return;
  }
})();

const rawConfig = parseEnvJson<UsercentricsConfig>(getEnvValue('NEXT_PUBLIC_USERCENTRICS_CONFIG') ?? '');

const config = !app.isPrivateMode && rawConfig ? Object.freeze({
  settingsId: rawConfig.settingsId,
  rulesetId: rawConfig.rulesetId,
  consent,
}) : undefined;

export default config;
