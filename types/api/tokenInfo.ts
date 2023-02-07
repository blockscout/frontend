import type { AddressParam } from './addressParams';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export interface TokenInfo {
  address: string;
  type: TokenType;
  symbol: string | null;
  name: string | null;
  decimals: string | null;
  holders: string | null;
  exchange_rate: string | null;
  total_supply: string | null;
}

export interface TokenCounters {
  token_holders_count: string;
  transfers_count: string;
}

export type TokenInfoGeneric<Type extends TokenType> = Omit<TokenInfo, 'type'> & { type: Type };

export interface TokenHolders {
  items: Array<TokenHolder>;
  next_page_params: TokenHoldersPagination;
}

export type TokenHolder = {
  address: AddressParam;
  value: string;
}

export type TokenHoldersPagination = {
  items_count: number;
  value: string;
}
