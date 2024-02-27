import type { TokenInfoApplication } from './account';
import type { AddressParam } from './addressParams';

export type NFTTokenType = 'ERC-721' | 'ERC-1155';
export type TokenType = 'ERC-20' | NFTTokenType;

export interface TokenInfo<T extends TokenType = TokenType> {
  address: string;
  type: T;
  symbol: string | null;
  name: string | null;
  decimals: string | null;
  holders: string | null;
  exchange_rate: string | null;
  total_supply: string | null;
  icon_url: string | null;
  circulating_market_cap: string | null;
  // bridged token fields
  is_bridged?: boolean | null;
  bridge_type?: string | null;
  origin_chain_id?: string | null;
  foreign_address?: string | null;
}

export interface TokenCounters {
  token_holders_count: string;
  transfers_count: string;
}

export interface TokenHolders {
  items: Array<TokenHolder>;
  next_page_params: TokenHoldersPagination | null;
}

export type TokenHolder = TokenHolderERC20ERC721 | TokenHolderERC1155;

export type TokenHolderBase = {
  address: AddressParam;
  value: string;
}

export type TokenHolderERC20ERC721 = TokenHolderBase & {
  token: TokenInfo<'ERC-20'> | TokenInfo<'ERC-721'>;
}

export type TokenHolderERC1155 = TokenHolderBase & {
  token: TokenInfo<'ERC-1155'>;
  token_id: string;
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
  owner: AddressParam | null;
}

export interface TokenInstanceTransfersCount {
  transfers_count: number;
}

export interface TokenInventoryResponse {
  items: Array<TokenInstance>;
  next_page_params: TokenInventoryPagination | null;
}

export type TokenInventoryPagination = {
  unique_token: number;
}

export type TokenVerifiedInfo = Omit<TokenInfoApplication, 'id' | 'status'>;

export type TokenInventoryFilters = {
  holder_address_hash?: string;
}
