// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { TransactionCelo } from 'src/features/chain-variants/celo/types/api';
import type { TransactionStability } from 'src/features/chain-variants/stability/types/api';
import type { TransactionSuave } from 'src/features/chain-variants/suave/types/api';
import type { TransactionZilliqa } from 'src/features/chain-variants/zilliqa/types/api';
import type { TransactionDataAvailability } from 'src/features/data-availability/types/api';
import type { TransactionFheOperations } from 'src/features/fhe-operations/types/api';
import type { TransactionOpInterop } from 'src/features/op-interop/types/api';
import type { TransactionArbitrum } from 'src/features/rollup/arbitrum/types/api';
import type { TransactionRollup } from 'src/features/rollup/common/types/api';
import type { TransactionOptimistic } from 'src/features/rollup/optimism/types/api';
import type { TransactionScroll } from 'src/features/rollup/scroll/types/api';
import type { TransactionZkSync } from 'src/features/rollup/zk-sync/types/api';
import type { TransactionActions } from 'src/features/tx-actions/types/api';
import type { TransactionAuthorization } from 'src/features/tx-authorization/types/api';
import type { BlockTransactionsResponse } from 'src/slices/block/types/api';

export interface TransactionFee {
  type: string;
  value: string | null;
}

export interface TxRawTrace {
  action: {
    callType: string;
    from: string;
    gas: string;
    input: string;
    to: string;
    value: string;
  };
  result: {
    gasUsed: string;
    output: string;
  };
  error: string | null;
  subtraces: number;
  traceAddress: Array<number>;
  type: string;
}

export type TxRawTracesResponse = Array<TxRawTrace>;

export type TransactionType = 'rootstock_remasc' |
'rootstock_bridge' |
'token_transfer' |
'contract_creation' |
'contract_call' |
'token_creation' |
'coin_transfer' |
'blob_transaction';

export interface Transaction extends
  TransactionRollup,
  TransactionSuave,
  TransactionStability,
  TransactionCelo,
  TransactionZilliqa,
  TransactionOptimistic,
  TransactionZkSync,
  TransactionArbitrum,
  TransactionScroll,
  TransactionOpInterop,
  TransactionFheOperations,
  TransactionAuthorization,
  TransactionActions,
  TransactionDataAvailability
{
  to: schemas['Address'] | null;
  created_contract: schemas['Address'] | null;
  hash: string;
  result: string;
  confirmations: number;
  status: 'ok' | 'error' | null | undefined;
  block_number: number | null;
  timestamp: string | null;
  confirmation_duration: Array<number> | null;
  from: schemas['Address'];
  value: string;
  fee: TransactionFee;
  gas_price: string | null;
  type: number | null;
  gas_used: string | null;
  gas_limit: string;
  max_fee_per_gas: string | null;
  max_priority_fee_per_gas: string | null;
  priority_fee: string | null;
  base_fee_per_gas: string | null;
  transaction_burnt_fee: string | null;
  nonce: number;
  position: number | null;
  revert_reason: NonNullable<schemas['Transaction']>['revert_reason'] | null;
  raw_input: string;
  decoded_input: schemas['DecodedInput'] | null;
  token_transfers: Array<schemas['TokenTransfer']> | null;
  token_transfers_overflow: boolean;
  exchange_rate: string | null;
  historic_exchange_rate: string | null;
  method: string | null;
  transaction_types: Array<TransactionType>;
  transaction_tag: string | null;
  has_error_in_internal_transactions: boolean | null;
  is_pending_update?: boolean;
};

export interface TransactionsStats {
  pending_transactions_count: string;
  transaction_fees_avg_24h: string;
  transaction_fees_sum_24h: string;
  transactions_count_24h: string;
}

// INDEX

export type TransactionsResponse = TransactionsResponseValidated | TransactionsResponsePending;

export interface TransactionsResponseValidated {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
    filter: 'validated';
  } | null;
}

export interface TransactionsResponsePending {
  items: Array<Transaction>;
  next_page_params: {
    inserted_at: string;
    hash: string;
    filter: 'pending';
  } | null;
}

export type TxsResponse = TransactionsResponseValidated | TransactionsResponsePending | BlockTransactionsResponse;

export interface TransactionsSorting {
  sort: 'value' | 'fee' | 'block_number';
  order: 'asc' | 'desc';
}

export type TransactionsSortingField = TransactionsSorting['sort'];

export type TransactionsSortingValue = `${ TransactionsSortingField }-${ TransactionsSorting['order'] }` | 'default';

export type TxsTypeFilter = 'token_transfer' | 'contract_creation' | 'contract_call' | 'coin_transfer' | 'token_creation' | 'blob_transaction';

export type TxsMethodFilter = 'approve' | 'transfer' | 'multicall' | 'mint' | 'commit';

export type TxsFilters = {
  filter: 'pending' | 'validated';
  type?: Array<TxsTypeFilter>;
  method?: Array<TxsMethodFilter>;
};
