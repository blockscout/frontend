// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type flashblocksConfig from './config';

// the feature config is a frozen module-level singleton, so it has to be imported inside `withEnvs`
async function loadConfig(envs: Array<[ string, string ]>): Promise<typeof flashblocksConfig> {
  return withEnvs(envs, async() => (await import('./config')).default);
}

describe('flashblocks feature config', () => {
  it('is disabled without a socket url', async() => {
    expect((await loadConfig([])).isEnabled).toBe(false);
  });

  it('calls the OP Stack feed "subblock" unless told otherwise', async() => {
    expect(await loadConfig(ENVS_MAP.flashblocks)).toMatchObject({
      isEnabled: true,
      type: 'optimism',
      name: 'subblock',
      tabIds: [ 'subblocks', 'flashblocks' ],
    });
  });

  it('calls the OP Stack feed "flashblock" when NEXT_PUBLIC_FLASHBLOCKS_NAME says so', async() => {
    const config = await loadConfig([ ...ENVS_MAP.flashblocks, [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'flashblock' ] ]);
    expect(config).toMatchObject({
      isEnabled: true,
      type: 'optimism',
      name: 'flashblock',
      tabIds: [ 'flashblocks', 'subblocks' ],
    });
  });

  it('falls back to "subblock" on a name it does not know', async() => {
    const config = await loadConfig([ ...ENVS_MAP.flashblocks, [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'miniblock' ] ]);
    expect(config).toMatchObject({ isEnabled: true, name: 'subblock' });
  });

  it('keeps the MegaETH name and tab whatever NEXT_PUBLIC_FLASHBLOCKS_NAME says', async() => {
    const config = await loadConfig([
      [ 'NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC', 'wss://localhost:3121' ],
      [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'flashblock' ],
    ]);
    expect(config).toMatchObject({ isEnabled: true, type: 'megaEth', name: 'mini-block', tabIds: [ 'mini-blocks' ] });
  });
});
