import type { TokenInfo, TokenType } from './token';
import type { TokenTransfer } from './tokenTransfer';

export type TokensResponse = {
  items: Array<TokenInfo>;
  next_page_params: {
    holder_count: number;
    items_count: number;
    name: string;
    market_cap: string | null;
  };
}

export type TokensFilters = { q: string; type: Array<TokenType> | undefined };

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
