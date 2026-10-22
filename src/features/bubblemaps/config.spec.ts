// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type bubblemapsConfig from './config';

async function loadConfig(envs: Array<[ string, string ]>): Promise<typeof bubblemapsConfig> {
  return withEnvs(envs, async() => {
    // `src/config` has to be imported first: reaching it through `./config` instead enters the
    // graph mid-cycle, and `src/shell/metadata/config` then reads `app.baseUrl` off an
    // uninitialised module
    await import('src/config');
    return (await import('./config')).default;
  });
}

describe('bubblemaps feature config', () => {
  it('is enabled with both the chain slug and the partner id', async() => {
    expect(await loadConfig(ENVS_MAP.bubblemaps)).toMatchObject({
      isEnabled: true,
      chainSlug: 'eth',
      partnerId: 'demo',
    });
  });

  it('is disabled without the chain slug', async() => {
    expect((await loadConfig([ [ 'NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID', 'demo' ] ])).isEnabled).toBe(false);
  });

  it('is disabled without the partner id', async() => {
    expect((await loadConfig([ [ 'NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG', 'eth' ] ])).isEnabled).toBe(false);
  });
});
