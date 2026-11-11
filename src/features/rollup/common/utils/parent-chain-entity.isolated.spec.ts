import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { parentChainAsEntityChain } from './parent-chain-entity';

const HASH = '0x3b1c5ecf1d17f3ac1dfb5c0d7a9b2f1e4c6a8d0b2e4f6a8c0e2d4f6a8b0c2d4e';

describe('parentChainAsEntityChain', () => {
  it('maps the parent chain onto the external chain shape', () => {
    expect(parentChainAsEntityChain({ id: 11155111, name: 'Sepolia', baseUrl: 'https://localhost:3101' })).toEqual({
      id: '11155111',
      name: 'Sepolia',
      explorer_url: 'https://localhost:3101',
      linkOnly: true,
    });
  });

  it('tolerates a parent chain without id and name', () => {
    expect(parentChainAsEntityChain({ baseUrl: 'https://localhost:3101' })).toEqual({
      id: '',
      name: '',
      explorer_url: 'https://localhost:3101',
      linkOnly: true,
    });
  });

  it('renders an L1 entity as a link only: explorer base url plus the app route, no shield, no hint', async() => {
    await withEnvs(ENVS_MAP.optimisticRollup, async() => {
      const { 'default': config } = await import('src/config');
      const { resolveEntityLink } = await import('src/shared/entities/resolve-entity-link');

      const rollupFeature = config.features.rollup;
      if (!rollupFeature.isEnabled) {
        throw new Error('rollup feature is expected to be enabled');
      }

      expect(resolveEntityLink({
        route: { pathname: '/address/[hash]', query: { hash: HASH, tab: 'txs' } },
        query: undefined,
        chain: parentChainAsEntityChain(rollupFeature.parentChain),
        contextChain: undefined,
        hintPrefix: ' on ',
      })).toEqual({
        href: `https://localhost:3101/address/${ HASH }?tab=txs`,
        isExternal: true,
        shield: undefined,
        hint: undefined,
      });
    });
  });
});
