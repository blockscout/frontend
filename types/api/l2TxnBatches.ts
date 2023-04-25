export type L2TxnBatchesItem = {
  epoch_number: number;
  l1_tx_hashes: Array<string>;
  l1_timestamp: string;
  l2_block_number: number;
  tx_count: number;
}

export type L2TxnBatchesResponse = {
  items: Array<L2TxnBatchesItem>;
  total: number;
  next_page_params: {
    index: number;
    items_count: number;
  };
}
