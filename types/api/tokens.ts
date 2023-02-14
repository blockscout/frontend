import type { TokenInfo, TokenType } from './token';

export type TokensResponse = {
  items: Array<TokenInfo>;
  next_page_params: {
    holder_count: number;
    items_count: number;
    name: string;
  };
}

export type TokensFilters = { filter: string; type: Array<TokenType> | undefined };
