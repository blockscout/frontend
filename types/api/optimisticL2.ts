import type { AddressParam } from './addressParams';
import type { Block } from './block';
import type { Transaction } from './transaction';

export type OptimisticL2DepositsItem = {
  l1_block_number: number;
  l1_transaction_hash: string;
  l1_block_timestamp: string;
  l1_transaction_origin: string;
  l2_transaction_gas_limit: string;
  l2_transaction_hash: string;
};

export type OptimisticL2DepositsResponse = {
  items: Array<OptimisticL2DepositsItem>;
  next_page_params: {
    items_count: number;
    l1_block_number: number;
    transaction_hash: string;
  };
};

export type OptimisticL2OutputRootsItem = {
  l1_block_number: number;
  l1_timestamp: string;
  l1_transaction_hash: string;
  l2_block_number: number;
  l2_output_index: number;
  output_root: string;
};

export type OptimisticL2OutputRootsResponse = {
  items: Array<OptimisticL2OutputRootsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
};

export type OptimisticL2BatchDataContainer = 'in_blob4844' | 'in_celestia' | 'in_calldata';

export type OptimisticL2TxnBatchesItem = {
  internal_id: number;
  batch_data_container?: OptimisticL2BatchDataContainer;
  l1_timestamp: string;
  l1_transaction_hashes: Array<string>;
  l2_block_start: number;
  l2_block_end: number;
  transaction_count: number;
};

export type OptimisticL2TxnBatchesResponse = {
  items: Array<OptimisticL2TxnBatchesItem>;
  next_page_params: {
    id: number;
    items_count: number;
  };
};

export interface OptimisticL2BlobTypeEip4844 {
  hash: string;
  l1_timestamp: string;
  l1_transaction_hash: string;
}

export interface OptimisticL2BlobTypeCelestia {
  commitment: string;
  height: number;
  l1_timestamp: string;
  l1_transaction_hash: string;
  namespace: string;
}

interface OptimismL2TxnBatchBase {
  internal_id: number;
  l1_timestamp: string;
  l1_transaction_hashes: Array<string>;
  l2_block_start: number;
  l2_block_end: number;
  transaction_count: number;
}

export interface OptimismL2TxnBatchTypeCallData extends OptimismL2TxnBatchBase {
  batch_data_container: 'in_calldata';
}

export interface OptimismL2TxnBatchTypeEip4844 extends OptimismL2TxnBatchBase {
  batch_data_container: 'in_blob4844';
  blobs: Array<OptimisticL2BlobTypeEip4844> | null;
}

export interface OptimismL2TxnBatchTypeCelestia extends OptimismL2TxnBatchBase {
  batch_data_container: 'in_celestia';
  blobs: Array<OptimisticL2BlobTypeCelestia> | null;
}

export type OptimismL2TxnBatch = OptimismL2TxnBatchTypeCallData | OptimismL2TxnBatchTypeEip4844 | OptimismL2TxnBatchTypeCelestia;

export type OptimismL2BatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};

export type OptimismL2BatchBlocks = {
  items: Array<Block>;
  next_page_params: {
    batch_number: number;
    items_count: number;
  } | null;
};

export type OptimisticL2WithdrawalsItem = {
  challenge_period_end: string | null;
  from: AddressParam | null;
  l1_transaction_hash: string | null;
  l2_timestamp: string | null;
  l2_transaction_hash: string;
  msg_nonce: number;
  msg_nonce_version: number;
  status: string;
};

export type OptimisticL2WithdrawalStatus =
  'Waiting for state root' |
  'Ready to prove' |
  'In challenge period' |
  'Waiting a game to resolve' |
  'Ready to prove' |
  'Proven' |
  'Ready for relay' |
  'Relayed';

export type OptimisticL2WithdrawalsResponse = {
  items: Array<OptimisticL2WithdrawalsItem>;
  next_page_params: {
    items_count: number;
    nonce: string;
  };
};

export type OptimisticL2DisputeGamesResponse = {
  items: Array<OptimisticL2DisputeGamesItem>;
  next_page_params: {
    items_count: number;
    index: number;
  };
};

export type OptimisticL2DisputeGamesItem = {
  contract_address: string;
  created_at: string;
  game_type: number;
  index: number;
  l2_block_number: number;
  resolved_at: string | null;
  status: string;
};
