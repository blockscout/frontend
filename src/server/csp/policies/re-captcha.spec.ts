// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it, vi } from 'vitest';

import { reCaptcha } from './re-captcha';

const multichainConfig = vi.hoisted(() => vi.fn());

vi.mock('src/config', () => ({
  'default': { services: { reCaptcha: { siteKey: undefined } } },
}));

vi.mock('src/features/multichain/chains-config', () => ({
  'default': multichainConfig,
}));

describe('reCaptcha policy', () => {
  it('is empty when no site key is configured anywhere', () => {
    multichainConfig.mockReturnValue(undefined);

    expect(reCaptcha(false)).toEqual({});
  });

  it('allows the widget when only a chain of the multichain config has a site key', () => {
    multichainConfig.mockReturnValue({
      chains: [
        { app_config: { services: { reCaptcha: { siteKey: undefined } } } },
        { app_config: { services: { reCaptcha: { siteKey: 'chain-site-key' } } } },
      ],
    });

    expect(reCaptcha(false)['script-src']).toContain('https://www.google.com/recaptcha/api.js');
  });

  it('stays empty in private mode', () => {
    multichainConfig.mockReturnValue({
      chains: [ { app_config: { services: { reCaptcha: { siteKey: 'chain-site-key' } } } } ],
    });

    expect(reCaptcha(true)).toEqual({});
  });
});
