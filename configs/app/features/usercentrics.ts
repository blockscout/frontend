import type { Feature } from './types';

import app from '../app';
import { getEnvValue, parseEnvJson } from '../utils';

interface UsercentricsConfig {
  readonly settingsId?: string;
  readonly rulesetId?: string;
}

const title = 'Usercentrics CMP';

const config: Feature<{ settingsId?: string; rulesetId?: string }> = (() => {
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
    });
  }

  return Object.freeze({ title, isEnabled: false as const });
})();

export default config;
