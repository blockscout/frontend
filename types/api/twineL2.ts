export type TwineL2DepositsItem = {
  tx_hash: string;
  nonce: number;
  chain_id: number;
  block_number: number;
  l1_token: string;
  l2_token: string;
  from_address: string;
  to_twine_address: string;
  amount: string;
  created_at: string;
};

export type TwineL2DepositsResponse = {
  items: Array<TwineL2DepositsItem>;
  next_page_params: {
    items_count: number;
    l1_block_number: number;
    transaction_hash: string;
  };
};
