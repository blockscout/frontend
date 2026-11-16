// @vitest-environment jsdom

import { chainA, chainB, chainC } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const INSTANCE_ORIGINS = [
  'https://localhost:3003',
  'https://localhost:3004',
  'https://localhost:3005',
  'https://localhost:3006',
  'https://api.clusters.xyz',
];

const ESSENTIAL_DAPPS_ENVS: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', JSON.stringify({ revoke: { chains: [ chainC.id ] } }) ],
];

const CHAIN_WITHOUT_APP_CONFIG = { id: '10', name: 'OP Mainnet' };

// the allow-list is cached for the lifetime of the module, so every test reads it from a fresh copy
async function getOrigins(envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => (await import('./getAllowedApiOrigins')).default());
}

describe('getAllowedApiOrigins', () => {
  it('allows the origin of every API the instance is configured with', async() => {
    expect(await getOrigins()).toEqual(new Set(INSTANCE_ORIGINS));
  });

  it('adds the APIs of every chain in the multichain cluster', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ chainA, chainB ] });

    const origins = await getOrigins(ENVS_MAP.multichain);

    expect(origins).toEqual(new Set([
      ...INSTANCE_ORIGINS,
      'http://localhost:3012',
      'http://localhost:3013',
      'http://localhost:4003',
      'http://localhost:4004',
    ]));
  });

  it('adds the core API of every essential dapps chain that has an app config', async() => {
    vi.stubGlobal('__essentialDappsChains', { chains: [ chainC, CHAIN_WITHOUT_APP_CONFIG ] });

    const origins = await getOrigins(ESSENTIAL_DAPPS_ENVS);

    expect(origins).toEqual(new Set([ ...INSTANCE_ORIGINS, 'http://localhost:4005' ]));
  });

  it('ignores an endpoint that is not a valid URL', async() => {
    const origins = await getOrigins([ [ 'NEXT_PUBLIC_NAME_SERVICE_API_HOST', 'not-a-url' ] ]);

    expect(origins).toEqual(new Set(INSTANCE_ORIGINS));
  });

  it('rejects origins that are not present in the configuration', async() => {
    vi.stubGlobal('__multichainConfig', { chains: [ chainA, chainB ] });
    vi.stubGlobal('__essentialDappsChains', { chains: [ chainC ] });

    const origins = await getOrigins([ ...ENVS_MAP.multichain, ...ESSENTIAL_DAPPS_ENVS ]);

    expect(origins.has('http://169.254.169.254')).toBe(false);
    expect(origins.has('http://localhost:3000')).toBe(false);
    expect(origins.has('https://evil.example.com')).toBe(false);
  });
});
