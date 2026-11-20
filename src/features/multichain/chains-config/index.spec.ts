// @vitest-environment jsdom

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const CLUSTER_CONFIG = { chains: [ chainA, chainB ] };

function readMultichainConfig(envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => (await import('./index')).default());
}

describe('multichainConfig', () => {
  it('returns the cluster config on the Multichain explorer', async() => {
    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);

    expect(await readMultichainConfig(ENVS_MAP.multichain)).toBe(CLUSTER_CONFIG);
  });

  it('returns undefined on the Multichain explorer when no config was generated', async() => {
    expect(await readMultichainConfig(ENVS_MAP.multichain)).toBeUndefined();
  });

  it('returns undefined on a single-chain instance even when the cluster config was generated', async() => {
    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);

    expect(await readMultichainConfig()).toBeUndefined();
  });

  it('returns undefined on a single-chain instance with no config', async() => {
    expect(await readMultichainConfig()).toBeUndefined();
  });
});
