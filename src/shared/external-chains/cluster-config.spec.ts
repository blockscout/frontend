// @vitest-environment jsdom

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const CLUSTER_CONFIG = { chains: [ chainA, chainB ] };

function readClusterConfig(envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => (await import('./cluster-config')).clusterConfig());
}

describe('clusterConfig in the browser', () => {
  it('returns the generated config on a single-chain instance', async() => {
    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);

    expect(await readClusterConfig()).toBe(CLUSTER_CONFIG);
  });

  it('returns the generated config on the Multichain explorer', async() => {
    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);

    expect(await readClusterConfig(ENVS_MAP.multichain)).toBe(CLUSTER_CONFIG);
  });

  it('returns undefined when no config was generated', async() => {
    expect(await readClusterConfig()).toBeUndefined();
    expect(await readClusterConfig(ENVS_MAP.multichain)).toBeUndefined();
  });
});
