// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BlockCelo } from 'client/features/chain-variants/celo/types/api';
import type { BlockRootstock } from 'client/features/chain-variants/rootstock/types/api';
import type { BlockZilliqa } from 'client/features/chain-variants/zilliqa/types/api';
import type { BlockDataAvailability } from 'client/features/data-availability/types/api';
import type { BlockArbitrum } from 'client/features/rollup/arbitrum/types/api';
import type { BlockOptimism } from 'client/features/rollup/optimism/types/api';
import type { BlockZkSync } from 'client/features/rollup/zk-sync/types/api';
import type { AddressParam } from 'client/slices/address/types/api';
import type { InternalTransaction } from 'client/slices/internal-tx/types/api';
import type { Transaction } from 'client/slices/tx/types/api';
import type { Reward } from 'types/api/reward';

export type BlockType = 'block' | 'reorg' | 'uncle';

export interface Block extends BlockArbitrum, BlockOptimism, BlockZkSync, BlockCelo, BlockZilliqa, BlockRootstock, BlockDataAvailability {
  height: number;
  timestamp: string;
  transactions_count: number;
  internal_transactions_count: number;
  miner: AddressParam;
  size?: number;
  hash: string;
  parent_hash: string;
  difficulty?: string;
  total_difficulty?: string | null;
  gas_used: string | null;
  gas_limit: string;
  nonce: string;
  base_fee_per_gas?: string | null;
  burnt_fees: string | null;
  priority_fee: string | null;
  extra_data: string | null;
  state_root: string | null;
  rewards?: Array<Reward>;
  gas_target_percentage: number | null;
  gas_used_percentage: number | null;
  burnt_fees_percentage: number | null;
  type: BlockType;
  transaction_fees: string | null;
  uncles_hashes: Array<string>;
  withdrawals_count?: number;
  beacon_deposits_count?: number;
  is_pending_update?: boolean;
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

export interface BlockInternalTransactionsResponse {
  items: Array<InternalTransaction>;
  next_page_params: {
    block_index: number;
    items_count: number;
  } | null;
}

export interface NewBlockSocketResponse {
  average_block_time: string;
  block: Block;
}

export interface BlockFilters {
  type?: BlockType;
}

export interface BlockCountdownResponse {
  result: {
    CountdownBlock: string;
    CurrentBlock: string;
    EstimateTimeInSec: string;
    RemainingBlock: string;
  } | null;
}

export type { BlockWithdrawalsResponse, BlockWithdrawalsItem } from 'client/features/chain-variants/beacon-chain/types/api';
