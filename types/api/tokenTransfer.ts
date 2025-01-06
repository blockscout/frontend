import type { AddressParam } from './addressParams';
import type { TokenInfo, TokenType } from './token';

export type Erc20TotalPayload = {
  decimals: string | null;
  value: string;
};

export type Erc721TotalPayload = {
  token_id: string | null;
};

export type Erc1155TotalPayload = {
  decimals: string | null;
  value: string;
  token_id: string | null;
};

export type Erc404TotalPayload = {
  decimals: string;
  value: string;
  token_id: null;
} | {
  token_id: string;
};

export type TokenTransfer = (
  {
    token: TokenInfo<'ERC-20'> | null;
    total: Erc20TotalPayload | null;
  } |
  {
    token: TokenInfo<'ERC-721'> | null;
    total: Erc721TotalPayload | null;
  } |
  {
    token: TokenInfo<'ERC-1155'> | null;
    total: Erc1155TotalPayload | null;
  } |
  {
    token: TokenInfo<'ERC-404'> | null;
    total: Erc404TotalPayload | null;
  }
) & TokenTransferBase;

export type TokenTotal = Erc20TotalPayload | Erc721TotalPayload | Erc1155TotalPayload;

interface TokenTransferBase {
  type: 'token_transfer' | 'token_burning' | 'token_spawning' | 'token_minting';
  transaction_hash: string;
  from: AddressParam;
  to: AddressParam;
  timestamp: string;
  block_number: string;
  block_hash: string;
  log_index: string;
  method?: string;
}

export type TokenTransferPagination = {
  block_number: number;
  index: number;
  items_count: number;
};

export interface TokenTransferResponse {
  items: Array<TokenTransfer>;
  next_page_params: TokenTransferPagination | null;
}

export interface TokenTransferFilters {
  type: Array<TokenType>;
}
