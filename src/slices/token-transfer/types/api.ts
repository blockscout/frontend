// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { TokenType } from 'src/slices/token/types/api';

export type Erc20TotalPayload = {
  decimals: string | null;
  value: string;
};

export type Erc721TotalPayload = {
  token_id: string | null;
  token_instance: schemas['TokenInstance'] | null;
};

export type Erc1155TotalPayload = {
  decimals: string | null;
  value: string;
  token_id: string | null;
  token_instance: schemas['TokenInstance'] | null;
};

export type Erc404TotalPayload = {
  decimals: string;
  value: string;
  token_id: null;
  token_instance: schemas['TokenInstance'] | null;
} | {
  token_id: string;
  token_instance: schemas['TokenInstance'] | null;
};

export type TokenTransfer = (
  {
    token: schemas['Token'] | null;
    total: Erc20TotalPayload | null;
  } |
  {
    token: schemas['Token'] | null;
    total: Erc721TotalPayload | null;
  } |
  {
    token: schemas['Token'] | null;
    total: Erc1155TotalPayload | null;
  } |
  {
    token: schemas['Token'] | null;
    total: Erc404TotalPayload | null;
  }
) & TokenTransferBase;

export type TokenTotal = Erc20TotalPayload | Erc721TotalPayload | Erc1155TotalPayload;

interface TokenTransferBase {
  type: 'token_transfer' | 'token_burning' | 'token_spawning' | 'token_minting';
  token_type: TokenType;
  transaction_hash: string | null;
  from: schemas['Address'];
  to: schemas['Address'];
  timestamp: string;
  block_number: string;
  block_hash: string;
  log_index: string;
  method?: string;
}

export interface TokenTransferFilters {
  type: Array<TokenType>;
}
