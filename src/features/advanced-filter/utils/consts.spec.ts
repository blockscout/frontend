// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { chainA } from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const chainWithoutErc8056 = chainA.app_config as ClusterChainConfig['app_config'];

const chainWithErc8056 = {
  ...chainWithoutErc8056,
  slices: {
    ...chainWithoutErc8056.slices,
    token: {
      ...chainWithoutErc8056.slices.token,
      additionalTypes: [ { id: 'ERC-8056', name: 'ERC-8056' } ],
    },
  },
} as ClusterChainConfig['app_config'];

describe('getColumnStates', () => {
  it('shows the multiplier column when the instance enables ERC-8056', async() => {
    const state = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
      const { getColumnStates } = await import('./consts');
      return getColumnStates().multiplier;
    });
    expect(state).toBe('on');
  });

  it('places the multiplier column between to and amount', async() => {
    const { TABLE_COLUMNS } = await import('./consts');
    const ids = TABLE_COLUMNS.map((column) => column.id);
    expect(ids.slice(ids.indexOf('to'), ids.indexOf('amount') + 1)).toEqual([ 'to', 'multiplier', 'amount' ]);
  });

  it('shows every other column', async() => {
    const { getColumnStates } = await import('./consts');
    expect(Object.entries(getColumnStates()).filter(([ , state ]) => state !== 'on').map(([ id ]) => id)).toEqual([ 'multiplier' ]);
  });

  it('hides the multiplier column when the instance does not enable ERC-8056', async() => {
    const { getColumnStates } = await import('./consts');
    expect(getColumnStates().multiplier).toBe('unavailable');
  });

  it('shows the multiplier column when the focused chain enables ERC-8056, regardless of the cluster config', async() => {
    const { getColumnStates } = await import('./consts');
    expect(getColumnStates(chainWithErc8056).multiplier).toBe('on');
  });

  it('hides the multiplier column when the focused chain does not enable ERC-8056, regardless of the cluster config', async() => {
    const state = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
      const { getColumnStates } = await import('./consts');
      return getColumnStates(chainWithoutErc8056).multiplier;
    });
    expect(state).toBe('unavailable');
  });
});
