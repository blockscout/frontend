export type ZkSyncBatchStatus = 'Sealed on L2' | 'Sent to L1' | 'Validated on L1' | 'Executed on L1';

export type ZkSyncBatchesItem = {
  'commit_transaction_hash': string | null;
  'commit_transaction_timestamp': string | null;
  'execute_transaction_hash': string | null;
  'execute_transaction_timestamp': string | null;
  'number': number;
  'prove_transaction_hash': string | null;
  'prove_transaction_timestamp': string | null;
  'status': ZkSyncBatchStatus;
  'timestamp': string;
  'tx_count': number;
}

export type ZkSyncBatchesResponse = {
  items: Array<ZkSyncBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
}
