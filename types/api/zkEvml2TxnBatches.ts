export type ZkEvmL2TxnBatchesItem = {
  number: number;
  verify_tx_hash: string | null;
  sequence_tx_hash: string | null;
  status: string;
  timestamp: string;
  tx_count: number;
}

export type ZkEvmL2TxnBatchesResponse = {
  items: Array<ZkEvmL2TxnBatchesItem>;
  next_page_params: {
    number: number;
    items_count: number;
  } | null;
}

export type ZkEvmL2TxnBatch = {
  acc_input_hash: string;
  global_exit_root: string;
  number: number;
  sequence_tx_hash: string;
  state_root: string;
  status: string;
  timestamp: string;
  transactions: Array<string>;
  verify_tx_hash: string;
}
