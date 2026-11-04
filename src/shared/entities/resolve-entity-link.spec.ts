// @vitest-environment jsdom
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { EntityChain, EntityLinkParams } from './resolve-entity-link';

const HASH = '0x3b1c5ecf1d17f3ac1dfb5c0d7a9b2f1e4c6a8d0b2e4f6a8c0e2d4f6a8b0c2d4e';

const txRoute = { pathname: '/tx/[hash]', query: { hash: HASH } } as const;
const addressRoute = { pathname: '/address/[hash]', query: { hash: HASH } } as const;
const tokenRoute = { pathname: '/token/[hash]', query: { hash: HASH } } as const;

const currentChain: EntityChain = { id: '1', name: 'Ethereum' };

const externalChain: EntityChain = {
  id: '8453',
  name: 'Base',
  logo: 'https://example.com/base.png',
  explorer_url: 'https://basescan.org/',
  route_templates: {
    tx: '/transaction/{hash}',
    address: '/account/{hash}',
    token: '/asset/{hash}',
  },
};

const externalChainWithoutTemplates: EntityChain = { id: '8453', name: 'Base', explorer_url: 'https://basescan.org' };

async function resolve(params: EntityLinkParams, envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => {
    window.__multichainConfig = envs ? { chains: [ clusterChains.chainA, clusterChains.chainB ] } : undefined;
    const { resolveEntityLink } = await import('./resolve-entity-link');
    return resolveEntityLink(params);
  });
}

const txParams = (overrides: Partial<EntityLinkParams>): EntityLinkParams => ({
  route: txRoute,
  chain: undefined,
  contextChain: undefined,
  hintPrefix: 'Transaction on ',
  routeTemplate: 'tx',
  ...overrides,
});

describe('resolveEntityLink', () => {
  describe('without a chain', () => {
    it('links to the current chain page with no shield', async() => {
      expect(await resolve(txParams({}))).toEqual({
        href: `/tx/${ HASH }`,
        isExternal: false,
        shield: undefined,
        hint: undefined,
      });
    });

    it('links to the multichain context chain page, still with no shield', async() => {
      expect(await resolve(txParams({ contextChain: clusterChains.chainA }), ENVS_MAP.multichain)).toEqual({
        href: `/chain/op-mainnet/tx/${ HASH }`,
        isExternal: false,
        shield: undefined,
        hint: undefined,
      });
    });
  });

  describe('with the current chain', () => {
    it('links to the plain app route and shows the placeholder shield', async() => {
      expect(await resolve(txParams({ chain: currentChain }))).toEqual({
        href: `/tx/${ HASH }`,
        isExternal: false,
        shield: { name: 'networks/icon-placeholder' },
        hint: 'Transaction on Ethereum (Chain ID: 1)',
      });
    });

    it('uses the chain logo as the shield when there is one', async() => {
      const result = await resolve(txParams({ chain: { ...currentChain, logo: 'https://example.com/eth.png' } }));
      expect(result.shield).toEqual({ src: 'https://example.com/eth.png' });
    });
  });

  describe('with a chain from the multichain config', () => {
    it('links to the chain-scoped route and takes shield and hint from the cluster config', async() => {
      const chain: EntityChain = { id: clusterChains.chainB.id, name: 'Some other name' };
      expect(await resolve(txParams({ chain }), ENVS_MAP.multichain)).toEqual({
        href: `/chain/op-testnet/tx/${ HASH }`,
        isExternal: false,
        shield: { src: clusterChains.chainB.logo },
        hint: 'Transaction on OP Testnet (Chain ID: 421)',
      });
    });

    it('ignores the multichain context chain', async() => {
      const result = await resolve(txParams({ chain: clusterChains.chainB, contextChain: clusterChains.chainA }), ENVS_MAP.multichain);
      expect(result.href).toBe(`/chain/op-testnet/tx/${ HASH }`);
    });
  });

  describe('with an external chain', () => {
    it('substitutes the hash into the route template of the explorer', async() => {
      expect(await resolve(txParams({ chain: externalChain }))).toEqual({
        href: `https://basescan.org/transaction/${ HASH }`,
        isExternal: true,
        shield: { src: 'https://example.com/base.png' },
        hint: 'Transaction on Base (Chain ID: 8453)',
      });
    });

    it('falls back to the app route when the explorer has no template', async() => {
      const result = await resolve(txParams({ chain: externalChainWithoutTemplates }));
      expect(result.href).toBe(`https://basescan.org/tx/${ HASH }`);
      expect(result.shield).toEqual({ name: 'networks/icon-placeholder' });
    });

    it('falls back to the app route when no template key is requested', async() => {
      const result = await resolve(txParams({ chain: externalChain, routeTemplate: undefined }));
      expect(result.href).toBe(`https://basescan.org/tx/${ HASH }`);
    });

    it('falls back to the app route when the route has no hash to substitute', async() => {
      const route = { pathname: '/block/[height_or_hash]', query: { height_or_hash: '123' } } as const;
      const result = await resolve(txParams({ route, chain: externalChain }));
      expect(result.href).toBe('https://basescan.org/block/123');
    });

    it('resolves to no link when the explorer url is missing', async() => {
      expect(await resolve(txParams({ chain: { id: '8453', name: 'Base' } }))).toEqual({
        href: undefined,
        isExternal: true,
        shield: { name: 'networks/icon-placeholder' },
        hint: 'Transaction on Base (Chain ID: 8453)',
      });
    });

    it('resolves to no link when the explorer url is malformed', async() => {
      const result = await resolve(txParams({ chain: { id: '8453', name: 'Base', explorer_url: 'basescan' } }));
      expect(result.href).toBeUndefined();
    });

    it('uses the address template and the address hint prefix', async() => {
      expect(await resolve(txParams({ route: addressRoute, chain: externalChain, hintPrefix: ' on ', routeTemplate: 'address' }))).toEqual({
        href: `https://basescan.org/account/${ HASH }`,
        isExternal: true,
        shield: { src: 'https://example.com/base.png' },
        hint: ' on Base (Chain ID: 8453)',
      });
    });

    it('uses the token template', async() => {
      const result = await resolve(txParams({ route: tokenRoute, chain: externalChain, routeTemplate: 'token' }));
      expect(result.href).toBe(`https://basescan.org/asset/${ HASH }`);
    });

    it('keeps the external resolution for a chain id that is not in the multichain config', async() => {
      const result = await resolve(txParams({ chain: externalChain }), ENVS_MAP.multichain);
      expect(result.href).toBe(`https://basescan.org/transaction/${ HASH }`);
      expect(result.isExternal).toBe(true);
    });
  });

  describe('with a link-only chain', () => {
    const linkOnlyChain: EntityChain = { id: clusterChains.chainA.id, name: 'L1', explorer_url: 'https://l1.example.com', linkOnly: true };

    it('links to the explorer with the app route and shows neither shield nor hint', async() => {
      expect(await resolve(txParams({ chain: linkOnlyChain }))).toEqual({
        href: `https://l1.example.com/tx/${ HASH }`,
        isExternal: true,
        shield: undefined,
        hint: undefined,
      });
    });

    it('stays external even when the chain id is in the multichain config', async() => {
      const result = await resolve(txParams({ chain: linkOnlyChain }), ENVS_MAP.multichain);
      expect(result.href).toBe(`https://l1.example.com/tx/${ HASH }`);
      expect(result.isExternal).toBe(true);
    });
  });

  describe('with shield disabled', () => {
    it('keeps the href and drops both shield and hint', async() => {
      expect(await resolve(txParams({ chain: externalChain, shield: false }))).toEqual({
        href: `https://basescan.org/transaction/${ HASH }`,
        isExternal: true,
        shield: undefined,
        hint: undefined,
      });
    });
  });
});
