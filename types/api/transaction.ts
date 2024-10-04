import type { AddressParam } from './addressParams';
import type { ArbitrumBatchStatus, ArbitrumL2TxData } from './arbitrumL2';
import type { BlockTransactionsResponse } from './block';
import type { DecodedInput } from './decodedInput';
import type { Fee } from './fee';
import type { NovesTxTranslation } from './noves';
import type { OptimisticL2WithdrawalStatus } from './optimisticL2';
import type { TokenInfo } from './token';
import type { TokenTransfer } from './tokenTransfer';
import type { TxAction } from './txAction';
import type { ZkSyncBatchesItem } from './zkSyncL2';

export type TransactionRevertReason = {
  raw: string;
} | DecodedInput;

type WrappedTransactionFields = 'decoded_input' | 'fee' | 'gas_limit' | 'gas_price' | 'hash' | 'max_fee_per_gas' |
'max_priority_fee_per_gas' | 'method' | 'nonce' | 'raw_input' | 'to' | 'type' | 'value';

export interface OpWithdrawal {
  l1_transaction_hash: string;
  nonce: number;
  status: OptimisticL2WithdrawalStatus;
}

export type Transaction = {
  to: AddressParam | null;
  created_contract: AddressParam | null;
  hash: string;
  result: string;
  confirmations: number;
  status: 'ok' | 'error' | null | undefined;
  block: number | null;
  timestamp: string | null;
  confirmation_duration: Array<number> | null;
  from: AddressParam;
  value: string;
  fee: Fee;
  gas_price: string | null;
  type: number | null;
  gas_used: string | null;
  gas_limit: string;
  max_fee_per_gas: string | null;
  max_priority_fee_per_gas: string | null;
  priority_fee: string | null;
  base_fee_per_gas: string | null;
  tx_burnt_fee: string | null;
  nonce: number;
  position: number | null;
  revert_reason: TransactionRevertReason | null;
  raw_input: string;
  decoded_input: DecodedInput | null;
  token_transfers: Array<TokenTransfer> | null;
  token_transfers_overflow: boolean;
  exchange_rate: string | null;
  method: string | null;
  tx_types: Array<TransactionType>;
  tx_tag: string | null;
  actions: Array<TxAction>;
  l1_fee?: string;
  l1_fee_scalar?: string;
  l1_gas_price?: string;
  l1_gas_used?: string;
  has_error_in_internal_txs: boolean | null;
  // optimism fields
  op_withdrawals?: Array<OpWithdrawal>;
  // SUAVE fields
  execution_node?: AddressParam | null;
  allowed_peekers?: Array<string>;
  wrapped?: Pick<Transaction, WrappedTransactionFields>;
  // Stability fields
  stability_fee?: {
    dapp_address: AddressParam;
    dapp_fee: string;
    token: TokenInfo;
    total_fee: string;
    validator_address: AddressParam;
    validator_fee: string;
  };
  // Celo fields
  celo?: {
    gas_token: TokenInfo<'ERC-20'> | null;
  };
  // zkEvm fields
  zkevm_verify_hash?: string;
  zkevm_batch_number?: number;
  zkevm_status?: typeof ZKEVM_L2_TX_STATUSES[number];
  zkevm_sequence_hash?: string;
  // zkSync FIELDS
  zksync?: Omit<ZkSyncBatchesItem, 'number' | 'tx_count' | 'timestamp'> & {
    'batch_number': number | null;
  };
  // blob tx fields
  blob_versioned_hashes?: Array<string>;
  blob_gas_used?: string;
  blob_gas_price?: string;
  burnt_blob_fee?: string;
  max_fee_per_blob_gas?: string;
  // Noves-fi
  translation?: NovesTxTranslation;
  arbitrum?: ArbitrumTransactionData;
}

type ArbitrumTransactionData = {
  batch_number: number;
  commitment_transaction: ArbitrumL2TxData;
  confirmation_transaction: ArbitrumL2TxData;
  contains_message: 'incoming' | 'outcoming' | null;
  gas_used_for_l1: string;
  gas_used_for_l2: string;
  network_fee: string;
  poster_fee: string;
  status: ArbitrumBatchStatus;
  message_related_info: {
    associated_l1_transaction: string | null;
    message_status: ArbitrumMessageStatus;
  };
}

export type ArbitrumMessageStatus = 'Relayed' | 'Syncing with base layer' | 'Waiting for confirmation' | 'Ready for relay' | 'Settlement pending';

export const ZKEVM_L2_TX_STATUSES = [ 'Confirmed by Sequencer', 'L1 Confirmed' ];

export interface TransactionsStats {
  pending_transactions_count: string;
  transaction_fees_avg_24h: string;
  transaction_fees_sum_24h: string;
  transactions_count_24h: string;
}

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

export interface TransactionsResponseWithBlobs {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

export interface TransactionsResponseWatchlist {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: 50;
  } | null;
}

export type TransactionType = 'rootstock_remasc' |
'rootstock_bridge' |
'token_transfer' |
'contract_creation' |
'contract_call' |
'token_creation' |
'coin_transfer' |
'blob_transaction'

export type TxsResponse = TransactionsResponseValidated | TransactionsResponsePending | BlockTransactionsResponse;

export interface TransactionsSorting {
  sort: 'value' | 'fee';
  order: 'asc' | 'desc';
}

export type TransactionsSortingField = TransactionsSorting['sort'];

export type TransactionsSortingValue = `${ TransactionsSortingField }-${ TransactionsSorting['order'] }`;
