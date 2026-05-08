import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';

export const NATIVE_TOKEN_ICON_URL = 'https://raw.githubusercontent.com/VinuChain/Media/master/icon_black.svg';

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
    name: 'ERC-20 Transfer',
  },
  {
    id: 'ERC-404',
    name: 'ERC-404 Transfer',
  },
  {
    id: 'ERC-721',
    name: 'ERC-721 Transfer',
  },
  {
    id: 'ERC-1155',
    name: 'ERC-1155 Transfer',
  },
  {
    id: 'contract_creation',
    name: 'Contract Creation',
  },
  {
    id: 'contract_interaction',
    name: 'Contract Interaction',
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
  icon_url: NATIVE_TOKEN_ICON_URL,
  symbol: config.chain.currency.symbol || '',
  address_hash: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;

export type AdvancedFilterTokenInfo = TokenInfo & {
  address?: string;
};

export function getAdvancedFilterTokenAddressHash(token: AdvancedFilterTokenInfo) {
  return token.address_hash || token.address || '';
}

export function isNativeToken(token: AdvancedFilterTokenInfo | null | undefined) {
  return token ? getAdvancedFilterTokenAddressHash(token).toLowerCase() === NATIVE_TOKEN.address_hash : false;
}

export function normalizeAdvancedFilterToken(token: AdvancedFilterTokenInfo): TokenInfo {
  const addressHash = getAdvancedFilterTokenAddressHash(token);

  if (addressHash.toLowerCase() === NATIVE_TOKEN.address_hash) {
    return {
      ...NATIVE_TOKEN,
      ...token,
      address_hash: NATIVE_TOKEN.address_hash,
      icon_url: token.icon_url || NATIVE_TOKEN.icon_url,
      name: token.name || NATIVE_TOKEN.name,
      symbol: token.symbol || NATIVE_TOKEN.symbol,
      type: token.type || NATIVE_TOKEN.type,
    };
  }

  return {
    ...token,
    address_hash: addressHash,
  };
}
