export type L2OutputRootsItem = {
  l1_block_number: number;
  l1_timestamp: string;
  l1_tx_hash: string;
  l2_block_number: number;
  l2_output_index: number;
  output_root: string;
}

export type L2OutputRootsResponse = {
  items: Array<L2OutputRootsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
}
