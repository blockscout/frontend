// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { STORAGE_KEY } from './consts';

const ENVS: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_USERCENTRICS_CONFIG', JSON.stringify({ rulesetId: 'test-ruleset' }) ],
  [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'mixpanel-token' ],
];

const ALL_ACCEPTED = {
  mixpanel: true,
  posthog: true,
  googleAnalytics: true,
  rollbar: true,
  growthBook: true,
  adbutler: true,
  slise: true,
  sevio: true,
  specify: true,
};

describe('usercentrics consent', () => {
  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it('withholds every service until the user answers the banner', async() => {
    await withEnvs(ENVS, async() => {
      const { 'default': config } = await import('src/config');

      expect(Object.values(config.services.usercentrics?.consent ?? {})).not.toContain(true);
      expect(config.services.mixpanel.projectToken).toBeUndefined();
    });
  });

  it('runs the services the user accepted', async() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_ACCEPTED));

    await withEnvs(ENVS, async() => {
      const { 'default': config } = await import('src/config');

      expect(config.services.mixpanel.projectToken).toBe('mixpanel-token');
    });
  });

  it('withholds every service when the stored consent cannot be read', async() => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');

    await withEnvs(ENVS, async() => {
      const { 'default': config } = await import('src/config');

      expect(config.services.mixpanel.projectToken).toBeUndefined();
    });
  });
});
