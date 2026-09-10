// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UsercentricsConsentResult } from './types';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import { STORAGE_KEY } from './consts';
import { CONSENT_RESULT_ALL_ACCEPTED } from './services';

interface UsercentricsConfig {
  readonly settingsId?: string;
  readonly rulesetId?: string;
}

const consent = (() => {
  if (isBrowser()) {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (consent) {
      try {
        return JSON.parse(consent) as UsercentricsConsentResult;
      } catch {}
    }
  }
  return CONSENT_RESULT_ALL_ACCEPTED;
})();

const rawConfig = parseEnvJson<UsercentricsConfig>(getEnvValue('NEXT_PUBLIC_USERCENTRICS_CONFIG') ?? '');

const config = !app.isPrivateMode && rawConfig && (rawConfig.settingsId || rawConfig.rulesetId) ? Object.freeze({
  settingsId: rawConfig.settingsId,
  rulesetId: rawConfig.rulesetId,
  isDraft: getEnvValue('NEXT_PUBLIC_USERCENTRICS_DRAFT') === 'true',
  consent,
}) : undefined;

export default config;
