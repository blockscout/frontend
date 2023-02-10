import type { AddressParam } from './addressParams';
import type { TokenInfoGeneric, TokenType } from './tokenInfo';

export type Erc20TotalPayload = {
  decimals: string | null;
  value: string;
}

export type Erc721TotalPayload = {
  token_id: string;
}

export type Erc1155TotalPayload = {
  decimals: string | null;
  value: string;
  token_id: string;
}

export type TokenTransfer = (
  {
    token: TokenInfoGeneric<'ERC-20'>;
    total: Erc20TotalPayload;
  } |
  {
    token: TokenInfoGeneric<'ERC-721'>;
    total: Erc721TotalPayload;
  } |
  {
    token: TokenInfoGeneric<'ERC-1155'>;
    total: Erc1155TotalPayload | Array<Erc1155TotalPayload>;
  }
) & TokenTransferBase

interface TokenTransferBase {
  type: 'token_transfer' | 'token_burning' | 'token_spawning' | 'token_minting';
  tx_hash: string;
  from: AddressParam;
  to: AddressParam;
  timestamp: string;
  block_hash: string;
  log_index: string;
  method?: string;
}

export type TokenTransferPagination = {
  block_number: number;
  index: number;
  items_count: number;
}

export interface TokenTransferResponse {
  items: Array<TokenTransfer>;
  next_page_params: TokenTransferPagination | null;
}

export interface TokenTransferFilters {
  type: Array<TokenType>;
}
