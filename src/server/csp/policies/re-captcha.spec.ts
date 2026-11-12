// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { chainA } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const APP_SITE_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', 'app-site-key' ] ];
const NO_APP_SITE_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', '' ] ];

function clusterChain(siteKey: string | undefined): ClusterChainConfig {
  return {
    ...chainA,
    app_config: { ...chainA.app_config, services: { ...chainA.app_config.services, reCaptcha: { siteKey } } },
  };
}

async function getPolicy(envs: Array<[ string, string ]>, isPrivateMode = false) {
  return withEnvs(envs, async() => (await import('./re-captcha')).reCaptcha(isPrivateMode));
}

describe('reCaptcha policy', () => {
  it('is empty when no site key is configured anywhere', async() => {
    expect(await getPolicy(NO_APP_SITE_KEY)).toEqual({});
  });

  it('allows the widget when the app has a site key', async() => {
    const policy = await getPolicy(APP_SITE_KEY);

    expect(policy['script-src']).toContain('https://www.google.com/recaptcha/api.js');
  });

  it('allows the widget when only a chain of the multichain config has a site key', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ clusterChain(undefined), clusterChain('chain-site-key') ] });

    const policy = await getPolicy([ ...NO_APP_SITE_KEY, ...ENVS_MAP.multichain ]);

    expect(policy['script-src']).toContain('https://www.google.com/recaptcha/api.js');
  });

  it('stays empty in private mode', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ clusterChain('chain-site-key') ] });

    expect(await getPolicy([ ...APP_SITE_KEY, ...ENVS_MAP.multichain ], true)).toEqual({});
  });
});
