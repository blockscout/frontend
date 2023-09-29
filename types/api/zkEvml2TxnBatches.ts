export type ZkEvmL2TxnBatchesItem = {
  number: number;
  verify_tx_hash: string;
  sequence_tx_hash: string;
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
