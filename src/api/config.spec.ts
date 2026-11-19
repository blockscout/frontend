// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Apis } from 'src/api/types';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const STATS_API_HOST: [ string, string ] = [ 'NEXT_PUBLIC_STATS_API_HOST', 'https://stats.example.com' ];
const VISUALIZE_API_HOST: [ string, string ] = [ 'NEXT_PUBLIC_VISUALIZE_API_HOST', 'https://visualize.example.com' ];

const getApisConfig = (envs: Array<[ string, string ]>): Promise<Apis> => {
  return withEnvs(envs, async() => (await import('./config')).default);
};

describe('Stats API base path', () => {
  it('is taken from NEXT_PUBLIC_STATS_API_BASE_PATH', async() => {
    const apis = await getApisConfig([ STATS_API_HOST, [ 'NEXT_PUBLIC_STATS_API_BASE_PATH', '/poa/core' ] ]);

    expect(apis.stats).toMatchObject({ endpoint: 'https://stats.example.com', basePath: '/poa/core' });
  });

  it('loses its trailing slash', async() => {
    const apis = await getApisConfig([ STATS_API_HOST, [ 'NEXT_PUBLIC_STATS_API_BASE_PATH', '/poa/core/' ] ]);

    expect(apis.stats?.basePath).toBe('/poa/core');
  });

  it('is empty when the variable is not set', async() => {
    const apis = await getApisConfig([ STATS_API_HOST ]);

    expect(apis.stats?.basePath).toBe('');
  });
});

describe('Visualize API base path', () => {
  it('is taken from NEXT_PUBLIC_VISUALIZE_API_BASE_PATH', async() => {
    const apis = await getApisConfig([ VISUALIZE_API_HOST, [ 'NEXT_PUBLIC_VISUALIZE_API_BASE_PATH', '/poa/core' ] ]);

    expect(apis.visualize).toMatchObject({ endpoint: 'https://visualize.example.com', basePath: '/poa/core' });
  });

  it('loses its trailing slash', async() => {
    const apis = await getApisConfig([ VISUALIZE_API_HOST, [ 'NEXT_PUBLIC_VISUALIZE_API_BASE_PATH', '/poa/core/' ] ]);

    expect(apis.visualize?.basePath).toBe('/poa/core');
  });

  it('is empty when the variable is not set', async() => {
    const apis = await getApisConfig([ VISUALIZE_API_HOST ]);

    expect(apis.visualize?.basePath).toBe('');
  });
});
