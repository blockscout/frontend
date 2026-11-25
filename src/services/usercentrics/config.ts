// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UsercentricsConsentResult } from './types';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import { STORAGE_KEY } from './consts';
import { CONSENT_RESULT_ALL_ACCEPTED, CONSENT_RESULT_ALL_DENIED } from './services';

interface UsercentricsConfig {
  readonly settingsId?: string;
  readonly rulesetId?: string;
}

const consent = (() => {
  // The server cannot read the user's choice, and the CSP and the server-rendered ads it builds from this
  // value must allow every service the user may have accepted. The browser applies the actual choice.
  if (!isBrowser()) {
    return CONSENT_RESULT_ALL_ACCEPTED;
  }

  const storedConsent = localStorage.getItem(STORAGE_KEY);
  if (storedConsent) {
    try {
      return JSON.parse(storedConsent) as UsercentricsConsentResult;
    } catch {}
  }
  return CONSENT_RESULT_ALL_DENIED;
})();

const rawConfig = parseEnvJson<UsercentricsConfig>(getEnvValue('NEXT_PUBLIC_USERCENTRICS_CONFIG') ?? '');

const config = !app.isPrivateMode && rawConfig && (rawConfig.settingsId || rawConfig.rulesetId) ? Object.freeze({
  settingsId: rawConfig.settingsId,
  rulesetId: rawConfig.rulesetId,
  isDraft: getEnvValue('NEXT_PUBLIC_USERCENTRICS_DRAFT') === 'true',
  consent,
}) : undefined;

export default config;
