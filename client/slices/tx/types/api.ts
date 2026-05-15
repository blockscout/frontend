// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TransactionCelo } from 'client/features/chain-variants/celo/types/api';
import type { TransactionStability } from 'client/features/chain-variants/stability/types/api';
import type { TransactionSuave } from 'client/features/chain-variants/suave/types/api';
import type { TransactionZilliqa } from 'client/features/chain-variants/zilliqa/types/api';
import type { TransactionDataAvailability } from 'client/features/data-availability/types/api';
import type { TransactionFheOperations } from 'client/features/fhe-operations/types/api';
import type { TransactionOpInterop } from 'client/features/op-interop/types/api';
import type { TransactionArbitrum } from 'client/features/rollup/arbitrum/types/api';
import type { TransactionRollup } from 'client/features/rollup/common/types/api';
import type { TransactionOptimistic } from 'client/features/rollup/optimism/types/api';
import type { TransactionScroll } from 'client/features/rollup/scroll/types/api';
import type { TransactionZkSync } from 'client/features/rollup/zk-sync/types/api';
import type { TransactionActions } from 'client/features/tx-actions/types/api';
import type { TransactionAuthorization } from 'client/features/tx-authorization/types/api';
import type { AddressParam } from 'client/slices/address/types/api';
import type { BlockTransactionsResponse } from 'client/slices/block/types/api';
import type { DecodedInput } from 'client/slices/log/types/api';
import type { Erc721TotalPayload, TokenTransfer } from 'client/slices/token-transfer/types/api';
import type { TokenInfo } from 'client/slices/token/types/api';

export type TransactionRevertReason = {
  raw: string;
} | DecodedInput;

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
  to: AddressParam | null;
  created_contract: AddressParam | null;
  hash: string;
  result: string;
  confirmations: number;
  status: 'ok' | 'error' | null | undefined;
  block_number: number | null;
  timestamp: string | null;
  confirmation_duration: Array<number> | null;
  from: AddressParam;
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
  revert_reason: TransactionRevertReason | null;
  raw_input: string;
  decoded_input: DecodedInput | null;
  token_transfers: Array<TokenTransfer> | null;
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

// STATE CHANGES
export type TxStateChange = (TxStateChangeCoin | TxStateChangeToken) & {
  address: AddressParam;
  is_miner: boolean;
  balance_before: string | null;
  balance_after: string | null;
};

export interface TxStateChangeCoin {
  type: 'coin';
  change: string;
  token: null;
}

export type TxStateChangeToken = TxStateChangeTokenErc20 | TxStateChangeTokenErc721 | TxStateChangeTokenErc1155;

type TxStateChangeDirection = 'from' | 'to';

export interface TxStateChangeTokenErc20 {
  type: 'token';
  token: TokenInfo;
  change: string;
}

export interface TxStateChangeTokenErc721 {
  type: 'token';
  token: TokenInfo;
  change: Array<{
    direction: TxStateChangeDirection;
    total: Erc721TotalPayload;
  }>;
}

export interface TxStateChangeTokenErc1155 {
  type: 'token';
  token: TokenInfo;
  change: string;
  token_id: string;
}

export interface TxStateChangeTokenErc404 {
  type: 'token';
  token: TokenInfo;
  change: string;
  token_id: string;
}

export type TxStateChanges = {
  items: Array<TxStateChange>;
  next_page_params: {
    items_count: number;
    state_changes: null;
  };
};
