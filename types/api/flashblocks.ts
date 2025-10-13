export interface FlashblockItemApiOptimism {
  payload_id: string;
  index: number;
  base?: {
    parent_beacon_block_root: string;
    parent_hash: string;
    fee_recipient: string;
    prev_randao: string;
    block_number: string;
    gas_limit: string;
    timestamp: string;
    extra_data: string;
    base_fee_per_gas: string;
  };
  diff: {
    state_root: string;
    receipts_root: string;
    logs_bloom: string;
    gas_used: string;
    block_hash: string;
    transactions: Array<string>;
  };
  metadata: {
    receipts: Record<string, unknown>;
  };
}

export interface FlashblockItemApiMegaEth {
  block_number: number;
  index: number;
  gas_used: number;
  gas_offset: number;
  timestamp: string;
  transactions: Array<unknown>;
  log_offset: number;
  tx_offset: number;
}
