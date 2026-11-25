import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('usercentrics consent on the server', () => {
  it('keeps every service enabled, since the CSP and the ad provider the server picks must cover whatever the user may have accepted', async() => {
    await withEnvs([
      [ 'NEXT_PUBLIC_USERCENTRICS_CONFIG', JSON.stringify({ rulesetId: 'test-ruleset' }) ],
      [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'mixpanel-token' ],
    ], async() => {
      const { 'default': config } = await import('src/config');

      expect(Object.values(config.services.usercentrics?.consent ?? {})).not.toContain(false);
      expect(config.services.mixpanel.projectToken).toBe('mixpanel-token');
    });
  });
});
