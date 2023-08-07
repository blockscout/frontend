import type { AddressParam } from 'types/api/addressParams';
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
  nonce: string;
  base_fee_per_gas: string | null;
  burnt_fees: string | null;
  priority_fee: string | null;
  extra_data: string | null;
  state_root: string | null;
  rewards?: Array<Reward>;
  gas_target_percentage: number | null;
  gas_used_percentage: number | null;
  burnt_fees_percentage: number | null;
  type: BlockType;
  tx_fees: string | null;
  uncles_hashes: Array<string>;
  withdrawals_count?: number;
  // ROOTSTOCK FIELDS
  bitcoin_merged_mining_coinbase_transaction?: string | null;
  bitcoin_merged_mining_header?: string | null;
  bitcoin_merged_mining_merkle_proof?: string | null;
  hash_for_merged_mining?: string | null;
  minimum_gas_price?: string | null;
}

export interface BlocksResponse {
  items: Array<Block>;
  next_page_params: {
    block_number: number;
    items_count: number;
  } | null;
}

export interface BlockTransactionsResponse {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    items_count: number;
    index: number;
  } | null;
}

export interface NewBlockSocketResponse {
  average_block_time: string;
  block: Block;
}

export interface BlockFilters {
  type?: BlockType;
}

export type BlockWithdrawalsResponse = {
  items: Array<BlockWithdrawalsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
}

export type BlockWithdrawalsItem = {
  amount: string;
  index: number;
  receiver: AddressParam;
  validator_index: number;
}
