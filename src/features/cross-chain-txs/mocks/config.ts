import type { ExternalChain } from 'src/shared/external-chains/types';

import { homeChain } from './chains';

export const config: Array<ExternalChain> = [
  {
    id: homeChain.id,
    name: 'C-Chain',
    logo: 'https://c-chain.com/logo.svg',
    explorer_url: 'https://c-chain.com/explorer',
    route_templates: {
      tx: '/transaction/{hash}',
      address: '/wallet/{hash}',
      token: '/address/{hash}',
    },
  },
  {
    id: '8021',
    name: 'Numine',
    logo: 'https://numine.com/logo.svg',
    explorer_url: 'https://numine.com',
  },
  {
    id: '4444',
    name: 'Duck chain',
    logo: undefined,
    explorer_url: 'https://duck.com',
  },
];
