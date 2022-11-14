import type { AddressParam } from 'types/api/addressParams';
import type { PaginationParams } from 'types/api/pagination';
import type { Reward } from 'types/api/reward';
import type { Transaction } from 'types/api/transaction';

export type BlockType = 'block' | 'reorg' | 'uncle';

export interface Block {
  height: number;
  timestamp: string;
  tx_count: number;
  miner: AddressParam;
  size: number;
  hash: string;
  parent_hash: string;
  difficulty: string;
  total_difficulty: string;
  gas_used: string | null;
  gas_limit: string;
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
  type: BlockType;
  tx_fees: string | null;
  uncles_hashes: Array<string>;
}

export interface BlocksResponse {
  items: Array<Block>;
  next_page_params: PaginationParams | null;
}

export interface BlockTransactionsResponse {
  items: Array<Transaction>;
  next_page_params: PaginationParams | null;
}

export interface NewBlockSocketResponse {
  average_block_time: string;
  block: Block;
}

export interface BlockFilters {
  type?: BlockType;
}
