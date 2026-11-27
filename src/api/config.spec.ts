// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Apis } from 'src/api/types';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const getApisConfig = (envs: Array<[ string, string ]>): Promise<Apis> => {
  return withEnvs(envs, async() => (await import('./config')).default);
};

const SERVICES = [
  {
    title: 'Stats',
    name: 'stats',
    hostEnv: 'NEXT_PUBLIC_STATS_API_HOST',
    basePathEnv: 'NEXT_PUBLIC_STATS_API_BASE_PATH',
    endpoint: 'https://stats.example.com',
  },
  {
    title: 'Visualize',
    name: 'visualize',
    hostEnv: 'NEXT_PUBLIC_VISUALIZE_API_HOST',
    basePathEnv: 'NEXT_PUBLIC_VISUALIZE_API_BASE_PATH',
    endpoint: 'https://visualize.example.com',
  },
] as const;

describe.each(SERVICES)('$title API base path', ({ name, hostEnv, basePathEnv, endpoint }) => {
  const host: [ string, string ] = [ hostEnv, endpoint ];

  it(`is taken from ${ basePathEnv }`, async() => {
    const apis = await getApisConfig([ host, [ basePathEnv, '/poa/core' ] ]);

    expect(apis[name]).toMatchObject({ endpoint, basePath: '/poa/core' });
  });

  it('loses its trailing slash', async() => {
    const apis = await getApisConfig([ host, [ basePathEnv, '/poa/core/' ] ]);

    expect(apis[name]?.basePath).toBe('/poa/core');
  });

  it('is empty when the variable is not set', async() => {
    const apis = await getApisConfig([ host ]);

    expect(apis[name]?.basePath).toBe('');
  });
});
