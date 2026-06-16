// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { BlockCelo } from 'src/features/chain-variants/celo/types/api';
import type { BlockRootstock } from 'src/features/chain-variants/rootstock/types/api';
import type { BlockZilliqa } from 'src/features/chain-variants/zilliqa/types/api';
import type { BlockDataAvailability } from 'src/features/data-availability/types/api';
import type { BlockArbitrum } from 'src/features/rollup/arbitrum/types/api';
import type { BlockOptimism } from 'src/features/rollup/optimism/types/api';
import type { BlockZkSync } from 'src/features/rollup/zk-sync/types/api';
import type { InternalTransaction } from 'src/slices/internal-tx/types/api';
import type { Transaction } from 'src/slices/tx/types/api';

export type BlockType = 'block' | 'reorg' | 'uncle';

export interface BlockReward {
  reward: string;
  type: 'Miner Reward' | 'Validator Reward' | 'Emission Reward' | 'Chore Reward' | 'Uncle Reward' | 'POA Mania Reward';
}

export interface Block extends BlockArbitrum, BlockOptimism, BlockZkSync, BlockCelo, BlockZilliqa, BlockRootstock, BlockDataAvailability {
  height: number;
  timestamp: string;
  transactions_count: number;
  internal_transactions_count: number;
  miner: schemas['Address'];
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
  rewards?: Array<BlockReward>;
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
  block: schemas['BlockResponse'];
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

export type { BlockWithdrawalsResponse, BlockWithdrawalsItem } from 'src/features/chain-variants/beacon-chain/types/api';
