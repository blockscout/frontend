// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const multichainConfig = vi.hoisted(() => vi.fn());

vi.mock('src/features/multichain/chains-config', () => ({
  'default': multichainConfig,
}));

const APP_SITE_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', 'app-site-key' ] ];
const NO_APP_SITE_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', '' ] ];

async function getPolicy(envs: Array<[ string, string ]>, isPrivateMode = false) {
  return withEnvs(envs, async() => (await import('./re-captcha')).reCaptcha(isPrivateMode));
}

describe('reCaptcha policy', () => {
  it('is empty when no site key is configured anywhere', async() => {
    multichainConfig.mockReturnValue(undefined);

    expect(await getPolicy(NO_APP_SITE_KEY)).toEqual({});
  });

  it('allows the widget when the app has a site key', async() => {
    multichainConfig.mockReturnValue(undefined);

    const policy = await getPolicy(APP_SITE_KEY);

    expect(policy['script-src']).toContain('https://www.google.com/recaptcha/api.js');
  });

  it('allows the widget when only a chain of the multichain config has a site key', async() => {
    multichainConfig.mockReturnValue({
      chains: [
        { app_config: { services: { reCaptcha: { siteKey: undefined } } } },
        { app_config: { services: { reCaptcha: { siteKey: 'chain-site-key' } } } },
      ],
    });

    const policy = await getPolicy(NO_APP_SITE_KEY);

    expect(policy['script-src']).toContain('https://www.google.com/recaptcha/api.js');
  });

  it('stays empty in private mode', async() => {
    multichainConfig.mockReturnValue({
      chains: [ { app_config: { services: { reCaptcha: { siteKey: 'chain-site-key' } } } } ],
    });

    expect(await getPolicy(APP_SITE_KEY, true)).toEqual({});
  });
});
