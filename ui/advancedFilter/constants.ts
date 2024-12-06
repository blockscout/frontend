import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';

export const ADVANCED_FILTER_TYPES = [
  {
    id: 'coin_transfer',
    name: 'Coin Transfer',
  },
  {
    id: 'ERC-20',
    name: 'ERC-20',
  },
  {
    id: 'ERC-404',
    name: ' ERC-404',
  },
  {
    id: 'ERC-721',
    name: 'ERC-721',
  },
  {
    id: 'ERC-1155',
    name: 'ERC-1155',
  },
] as const;

export const ADVANCED_FILTER_TYPES_WITH_ALL = [
  {
    id: 'all',
    name: 'All',
  },
  ...ADVANCED_FILTER_TYPES,
];

export const NATIVE_TOKEN = {
  name: config.chain.currency.name || '',
  icon_url: '',
  symbol: config.chain.currency.symbol || '',
  address: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;
