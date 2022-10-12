import type { AddressParam } from 'types/api/addressParams';
import type { Reward } from 'types/api/reward';

export interface Block {
  height: number;
  timestamp: string;
  tx_count: number;
  miner: AddressParam;
  size: number;
  hash: string;
  parent_hash: string;
  difficulty: number;
  total_difficulty: number;
  gas_used: number;
  gas_limit: number;
  nonce: number;
  base_fee_per_gas: number | null;
  burnt_fees: number | null;
  priority_fee: number | null;
  extra_data: string | null;
  state_root: string | null;
  rewards?: Array<Reward>;
  gas_target_percentage: number | null;
  gas_used_percentage: number | null;
  burnt_fees_percentage: number | null;
  type: 'block' | 'reorg' | 'uncle';
  tx_fees: string | null;
  uncles_hashes: Array<string>;
}

export interface BlockResponse {
  items: Array<Block>;
  next_page_params: {
    block_number: number;
    items_count: number;
  };
}
