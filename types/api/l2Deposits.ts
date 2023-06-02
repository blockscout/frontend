export type L2DepositsItem = {
  l1_block_number: number;
  l1_tx_hash: string;
  l1_block_timestamp: string;
  l1_tx_origin: string;
  l2_tx_gas_limit: string;
  l2_tx_hash: string;
}

export type L2DepositsResponse = {
  items: Array<L2DepositsItem>;
  next_page_params: {
    items_count: number;
    l1_block_number: number;
    tx_hash: string;
  };
}
