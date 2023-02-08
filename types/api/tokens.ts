import type { AddressParam } from './addressParams';
import type { TokenInfo, TokenType } from './tokenInfo';

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
  is_unique: string;
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
