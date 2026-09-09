// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const NO_RPC_URL: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_NETWORK_RPC_URL', '' ] ];

describe('on a chain without Pro API support', () => {
  it('points Hardhat at the instance API and asks for no key', async() => {
    const { getHardhatVerificationParams } = await import('./utils');

    expect(getHardhatVerificationParams()).toEqual({
      rpcUrl: 'https://localhost:1111',
      apiKey: 'empty',
      apiUrl: 'https://localhost:3003/api',
    });
  });

  it('points Foundry at the instance API and passes no key', async() => {
    const { getFoundryVerificationParams } = await import('./utils');

    expect(getFoundryVerificationParams()).toEqual({
      rpcUrl: 'https://localhost:1111',
      apiKey: undefined,
      verifierUrl: 'https://localhost:3003/api/',
    });
  });

  it('keeps the instance API base path in the urls', async() => {
    await withEnvs([ ...NO_RPC_URL, [ 'NEXT_PUBLIC_API_BASE_PATH', '/poa/core' ] ], async() => {
      const { getHardhatVerificationParams, getFoundryVerificationParams } = await import('./utils');

      expect(getHardhatVerificationParams().apiUrl).toBe('https://localhost:3003/poa/core/api');
      expect(getFoundryVerificationParams().verifierUrl).toBe('https://localhost:3003/poa/core/api/');
      expect(getFoundryVerificationParams().rpcUrl).toBe('https://localhost:3003/poa/core/api/eth-rpc');
    });
  });

  it('falls back to the instance eth-rpc endpoint when the chain has no RPC url', async() => {
    await withEnvs(NO_RPC_URL, async() => {
      const { getHardhatVerificationParams, getFoundryVerificationParams } = await import('./utils');

      expect(getHardhatVerificationParams().rpcUrl).toBe('https://localhost:3003/api/eth-rpc');
      expect(getFoundryVerificationParams().rpcUrl).toBe('https://localhost:3003/api/eth-rpc');
    });
  });
});

describe('on a chain with Pro API support', () => {
  it('points Hardhat at the Pro API and asks for a key', async() => {
    await withEnvs(ENVS_MAP.proApi, async() => {
      const { getHardhatVerificationParams } = await import('./utils');

      expect(getHardhatVerificationParams()).toEqual({
        rpcUrl: 'https://localhost:1111',
        apiKey: '{PRO_API_KEY}',
        apiUrl: 'https://api.blockscout.com/1/api',
      });
    });
  });

  it('points Foundry at the Pro API and passes a key', async() => {
    await withEnvs(ENVS_MAP.proApi, async() => {
      const { getFoundryVerificationParams } = await import('./utils');

      expect(getFoundryVerificationParams()).toEqual({
        rpcUrl: 'https://localhost:1111',
        apiKey: '{PRO_API_KEY}',
        verifierUrl: 'https://api.blockscout.com/v2/api?chain_id=1',
      });
    });
  });

  it('falls back to the Pro API json-rpc endpoint when the chain has no RPC url', async() => {
    await withEnvs([ ...ENVS_MAP.proApi, ...NO_RPC_URL ], async() => {
      const { getHardhatVerificationParams, getFoundryVerificationParams } = await import('./utils');

      expect(getHardhatVerificationParams().rpcUrl).toBe('https://api.blockscout.com/1/json-rpc?apikey={PRO_API_KEY}');
      expect(getFoundryVerificationParams().rpcUrl).toBe('https://api.blockscout.com/1/json-rpc?apikey={PRO_API_KEY}');
    });
  });
});
