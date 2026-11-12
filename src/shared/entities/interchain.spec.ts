// @vitest-environment jsdom
import type { ExternalChain } from 'src/shared/external-chains/types';

import * as clusterChains from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const currentChain: ExternalChain = { id: '1', name: 'Ethereum' };
const externalChain: ExternalChain = { id: '8453', name: 'Base', explorer_url: 'https://basescan.org' };
const explorerlessChain: ExternalChain = { id: '420', name: 'Unknown chain' };

async function load(envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => {
    vi.stubGlobal('__multichainConfig', envs ? { chains: [ clusterChains.chainA, clusterChains.chainB ] } : undefined);
    const interchain = await import('./interchain');
    const { toTokenChain } = await import('src/slices/token/components/entity/TokenEntityInterchain');
    return { ...interchain, toTokenChain };
  });
}

describe('isLinkableChain', () => {
  it('links the current chain, a chain with an explorer and no other', async() => {
    const { isLinkableChain } = await load();

    expect(isLinkableChain(currentChain)).toBe(true);
    expect(isLinkableChain(externalChain)).toBe(true);
    expect(isLinkableChain(explorerlessChain)).toBe(false);
    expect(isLinkableChain(undefined)).toBe(false);
  });

  it('links a cluster chain without an explorer url', async() => {
    const { isLinkableChain } = await load(ENVS_MAP.multichain);

    expect(isLinkableChain({ id: clusterChains.chainA.id, name: 'OP' })).toBe(true);
  });
});

describe('isClusterChain', () => {
  it('is false outside a multichain deployment', async() => {
    const { isClusterChain } = await load();

    expect(isClusterChain({ id: clusterChains.chainA.id, name: 'OP' })).toBe(false);
  });

  it('is true for a member of the cluster', async() => {
    const { isClusterChain } = await load(ENVS_MAP.multichain);

    expect(isClusterChain({ id: clusterChains.chainA.id, name: 'OP' })).toBe(true);
    expect(isClusterChain(externalChain)).toBe(false);
  });
});

describe('toTokenChain', () => {
  it('drops the current chain and a missing chain', async() => {
    const { toTokenChain } = await load();

    expect(toTokenChain(undefined)).toBeUndefined();
    expect(toTokenChain(currentChain)).toBeUndefined();
  });

  it('outside a multichain deployment a foreign chain is link-only', async() => {
    const { toTokenChain } = await load();

    expect(toTokenChain(externalChain)).toEqual({ ...externalChain, linkOnly: true });
  });

  it('inside a multichain deployment a foreign chain keeps its shield and a cluster chain passes through', async() => {
    const { toTokenChain } = await load(ENVS_MAP.multichain);
    const clusterChain = { id: clusterChains.chainA.id, name: 'OP' };

    expect(toTokenChain(externalChain)).toBe(externalChain);
    expect(toTokenChain(clusterChain)).toBe(clusterChain);
  });
});
