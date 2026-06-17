// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type TxInternalsType = 'call' | 'delegatecall' | 'staticcall' | 'create' | 'create2' | 'selfdestruct' | 'reward';

export type InternalTransaction = (
  {
    to: schemas['Address'];
    created_contract: null;
  } |
  {
    to: null;
    created_contract: schemas['Address'];
  }
) & {
  error: string | null;
  success: boolean;
  type: TxInternalsType;
  transaction_hash: string;
  from: schemas['Address'];
  value: string;
  index: number;
  block_number: number;
  timestamp: string;
  gas_limit: string;
};

export interface InternalTransactionsResponse {
  items: Array<InternalTransaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
    transaction_hash: string;
    transaction_index: number;
  } | null;
}

export interface InternalTransactionFilters {
  transaction_hash: string;
}
