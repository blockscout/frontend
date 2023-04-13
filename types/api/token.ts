import type { AddressParam } from './addressParams';

export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155';

export interface TokenInfo<T extends TokenType = TokenType> {
  address: string;
  type: T;
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
  next_page_params: TokenHoldersPagination | null;
}

export type TokenHolder = {
  address: AddressParam;
  value: string;
}

export type TokenHoldersPagination = {
  items_count: number;
  value: string;
}

export interface TokenInstance {
  is_unique: boolean;
  id: string;
  holder_address_hash: string | null;
  image_url: string | null;
  animation_url: string | null;
  external_app_url: string | null;
  metadata: Record<string, unknown> | null;
  owner: AddressParam;
  token: TokenInfo;
}

export interface TokenInstanceTransfersCount {
  transfers_count: number;
}

export interface TokenInventoryResponse {
  items: Array<TokenInstance>;
  next_page_params: TokenInventoryPagination;
}

export type TokenInventoryPagination = {
  unique_token: number;
}
