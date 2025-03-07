import type { Transaction } from './transaction';

export const ZKSYNC_L2_TX_BATCH_STATUSES = [
  'Processed on L2' as const,
  'Sealed on L2' as const,
  'Sent to L1' as const,
  'Validated on L1' as const,
  'Executed on L1' as const,
];

export type ZkSyncBatchStatus = typeof ZKSYNC_L2_TX_BATCH_STATUSES[number];

export interface ZkSyncBatchesItem {
  commit_transaction_hash: string | null;
  commit_transaction_timestamp: string | null;
  execute_transaction_hash: string | null;
  execute_transaction_timestamp: string | null;
  number: number;
  prove_transaction_hash: string | null;
  prove_transaction_timestamp: string | null;
  status: ZkSyncBatchStatus;
  timestamp: string;
  transaction_count: number;
}

export type ZkSyncBatchesResponse = {
  items: Array<ZkSyncBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
};

export interface ZkSyncBatch extends Omit<ZkSyncBatchesItem, 'transaction_count'> {
  start_block: number;
  end_block: number;
  l1_gas_price: string;
  l1_transaction_count: number;
  l2_fair_gas_price: string;
  l2_transaction_count: number;
  root_hash: string;
}

export type ZkSyncBatchTxs = {
  items: Array<Transaction>;
  next_page_params: {
    batch_number: string;
    block_number: number;
    index: number;
    items_count: number;
  } | null;
};
