// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { chainA } from 'src/features/multichain/mocks/chains';

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

type Env = [ string, string ];

const AGGREGATOR_HOST = 'https://aggregator.example.com';
const OTHER_CHAIN_API = 'https://api.other-chain.example.com';
const OTHER_CHAIN_SOCKET = 'wss://api.other-chain.example.com';
const OTHER_CHAIN_RPC = 'https://rpc.other-chain.example.com';

const AGGREGATOR_API: Array<Env> = [
  [ 'NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST', AGGREGATOR_HOST ],
  [ 'NEXT_PUBLIC_MULTICHAIN_CLUSTER', 'test' ],
];
const MULTICHAIN_EXPLORER: Array<Env> = [
  ...AGGREGATOR_API,
  [ 'NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST', 'https://stats.example.com' ],
  [ 'NEXT_PUBLIC_MULTICHAIN_ENABLED', 'true' ],
];

const otherChain: ClusterChainConfig = {
  ...chainA,
  app_config: {
    ...chainA.app_config,
    chain: { ...chainA.app_config.chain, rpcUrls: [ OTHER_CHAIN_RPC ] },
    apis: { core: { host: 'api.other-chain.example.com', protocol: 'https', endpoint: OTHER_CHAIN_API, socketEndpoint: OTHER_CHAIN_SOCKET } },
  },
};

async function getConnectSrc(envs: Array<Env>): Promise<Array<string>> {
  const policy = await withEnvs(envs, async() => (await import('./generateCspPolicy')).default());
  const directive = policy.split(';').map((item) => item.trim()).find((item) => item.startsWith('connect-src '));

  return directive?.split(' ') ?? [];
}

describe('cluster hosts in connect-src', () => {
  it('allows the aggregator but no other cluster chain on a single-chain instance with the multichain portfolio', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ otherChain ] });

    const connectSrc = await getConnectSrc(AGGREGATOR_API);

    expect(connectSrc).toContain(AGGREGATOR_HOST);
    expect(connectSrc).not.toContain(OTHER_CHAIN_API);
    expect(connectSrc).not.toContain(OTHER_CHAIN_SOCKET);
    expect(connectSrc).not.toContain(OTHER_CHAIN_RPC);
  });

  it('allows the cluster chains on the Multichain explorer', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ otherChain ] });

    const connectSrc = await getConnectSrc(MULTICHAIN_EXPLORER);

    expect(connectSrc).toContain(AGGREGATOR_HOST);
    expect(connectSrc).toContain(OTHER_CHAIN_API);
    expect(connectSrc).toContain(OTHER_CHAIN_SOCKET);
    expect(connectSrc).toContain(OTHER_CHAIN_RPC);
  });
});
