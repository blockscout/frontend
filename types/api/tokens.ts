import type { AddressParam } from './addressParams';
import type { TokenInfo, TokenType } from './tokenInfo';
import type { TokenTransfer } from './tokenTransfer';

export type TokensResponse = {
  items: Array<TokenInfo>;
  next_page_params: {
    holder_count: number;
    items_count: number;
    name: string;
  };
}

export type TokensFilters = { filter: string; type: Array<TokenType> | undefined };

export interface TokenInstance {
  is_unique: boolean;
  id: string;
  holder_address_hash: string | null;
  image_url: string | null;
  animation_url: string | null;
  external_app_url: string | null;
  metadata: unknown;
  owner: AddressParam;
  token: TokenInfo;
}

export interface TokenInstanceTransfersCount {
  transfers_count: number;
}

export interface TokenInstanceTransferResponse {
  items: Array<TokenTransfer>;
  next_page_params: TokenInstanceTransferPagination | null;
}

export interface TokenInstanceTransferPagination {
  block_number: number;
  index: number;
  items_count: number;
  token_id: string;
}
