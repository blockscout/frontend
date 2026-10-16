import type { GetInstancesResponse } from '@blockscout/points-types';

export const base: GetInstancesResponse = {
  items: [
    {
      chain_id: '1',
      name: 'Ethereum',
      domain: 'eth.blockscout.com',
      details: undefined,
    },
    {
      chain_id: '100',
      name: 'Gnosis',
      domain: 'gnosis.blockscout.com',
      details: undefined,
    },
  ],
};
