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

describe('getTableColumns', () => {
  it('places the multiplier column between to and amount when the instance enables ERC-8056', async() => {
    const ids = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
      const { getTableColumns } = await import('./consts');
      return getTableColumns().map((column) => column.id);
    });
    expect(ids.slice(ids.indexOf('to'), ids.indexOf('amount') + 1)).toEqual([ 'to', 'multiplier', 'amount' ]);
  });

  it('omits the multiplier column when the instance does not enable ERC-8056', async() => {
    const { getTableColumns } = await import('./consts');
    expect(getTableColumns().map((column) => column.id)).not.toContain('multiplier');
  });

  it('shows the multiplier column when the focused chain enables ERC-8056, regardless of the cluster config', async() => {
    const { getTableColumns } = await import('./consts');
    expect(getTableColumns(chainWithErc8056).map((column) => column.id)).toContain('multiplier');
  });

  it('omits the multiplier column when the focused chain does not enable ERC-8056, regardless of the cluster config', async() => {
    const ids = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
      const { getTableColumns } = await import('./consts');
      return getTableColumns(chainWithoutErc8056).map((column) => column.id);
    });
    expect(ids).not.toContain('multiplier');
  });
});
