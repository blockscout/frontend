import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';

export type ColumnsIds = 'tx_hash' | 'type' | 'method' | 'age' | 'from' | 'or_and' | 'to' | 'amount' | 'asset' | 'fee';

type TxTableColumn = {
  id: ColumnsIds;
  name: string;
  width: string;
  isNumeric?: boolean;
};

export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
    width: '180px',
  },
  {
    id: 'type',
    name: 'Type',
    width: '160px',
  },
  {
    id: 'method',
    name: 'Method',
    width: '160px',
  },
  {
    id: 'age',
    name: 'Age',
    width: '190px',
  },
  {
    id: 'from',
    name: 'From',
    width: '160px',
  },
  {
    id: 'or_and',
    name: '',
    width: '65px',
  },
  {
    id: 'to',
    name: 'To',
    width: '160px',
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
    width: '150px',
  },
  {
    id: 'asset',
    name: 'Asset',
    width: '120px',
  },
  {
    id: 'fee',
    name: 'Fee',
    isNumeric: true,
    width: '120px',
  },
] as const;

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
  address_hash: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;
