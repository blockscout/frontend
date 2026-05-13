import type { Feature } from './types';
import type { UsercentricsConsentResult } from 'client/shared/analytics/usercentrics/types';

import { CONSENT_RESULT_ALL_ACCEPTED } from 'client/shared/analytics/usercentrics/services';

import { isBrowser } from 'toolkit/utils/isBrowser';

import app from '../app';
import { getEnvValue, parseEnvJson } from '../utils';

export const STORAGE_KEY = 'usercentrics-consent';

interface UsercentricsConfig {
  readonly settingsId?: string;
  readonly rulesetId?: string;
}

const title = 'Usercentrics CMP';

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

const config: Feature<{ settingsId?: string; rulesetId?: string; consent?: UsercentricsConsentResult }> = (() => {
  if (app.isPrivateMode) {
    return Object.freeze({ title, isEnabled: false as const });
  }

  const rawConfig = parseEnvJson<UsercentricsConfig>(getEnvValue('NEXT_PUBLIC_USERCENTRICS_CONFIG') ?? '');

  if (rawConfig?.settingsId || rawConfig?.rulesetId) {
    return Object.freeze({
      title,
      isEnabled: true as const,
      settingsId: rawConfig.settingsId,
      rulesetId: rawConfig.rulesetId,
      consent,
    });
  }

  return Object.freeze({ title, isEnabled: false as const });
})();

export default config;
