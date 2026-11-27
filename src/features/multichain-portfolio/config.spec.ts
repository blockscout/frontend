// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

type Env = [ string, string ];

const CLUSTER: Env = [ 'NEXT_PUBLIC_MULTICHAIN_CLUSTER', 'test' ];
const AGGREGATOR_HOST: Env = [ 'NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST', 'http://localhost:3012' ];
const STATS_HOST: Env = [ 'NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST', 'http://localhost:3013' ];
const MULTICHAIN_EXPLORER_ON: Env = [ 'NEXT_PUBLIC_MULTICHAIN_ENABLED', 'true' ];
const MULTICHAIN_EXPLORER_OFF: Env = [ 'NEXT_PUBLIC_MULTICHAIN_ENABLED', 'false' ];

async function loadFeatures(envs: Array<Env>) {
  return withEnvs(envs, async() => (await import('src/config')).default.features);
}

describe('multichain portfolio feature config', () => {
  it('is enabled with both the aggregator host and the cluster', async() => {
    const features = await loadFeatures([ AGGREGATOR_HOST, CLUSTER ]);

    expect(features.multichainPortfolio.isEnabled).toBe(true);
    expect(features.multichain.isEnabled).toBe(false);
  });

  it('is enabled when the Multichain explorer flag is set to false', async() => {
    expect((await loadFeatures([ AGGREGATOR_HOST, CLUSTER, MULTICHAIN_EXPLORER_OFF ])).multichainPortfolio.isEnabled).toBe(true);
  });

  it('is disabled without the cluster', async() => {
    expect((await loadFeatures([ AGGREGATOR_HOST ])).multichainPortfolio.isEnabled).toBe(false);
  });

  it('is disabled without the aggregator host', async() => {
    expect((await loadFeatures([ CLUSTER ])).multichainPortfolio.isEnabled).toBe(false);
  });

  it('is disabled on the Multichain explorer', async() => {
    const features = await loadFeatures([ AGGREGATOR_HOST, CLUSTER, STATS_HOST, MULTICHAIN_EXPLORER_ON ]);

    expect(features.multichain.isEnabled).toBe(true);
    expect(features.multichainPortfolio.isEnabled).toBe(false);
  });

  it('is disabled when the Multichain explorer flag is on but its stats API is missing', async() => {
    const features = await loadFeatures([ AGGREGATOR_HOST, CLUSTER, MULTICHAIN_EXPLORER_ON ]);

    expect(features.multichain.isEnabled).toBe(false);
    expect(features.multichainPortfolio.isEnabled).toBe(false);
  });
});
