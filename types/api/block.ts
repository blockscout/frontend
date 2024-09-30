import type { AddressParam } from 'types/api/addressParams';
import type { Reward } from 'types/api/reward';
import type { Transaction } from 'types/api/transaction';

import type { ArbitrumBatchStatus, ArbitrumL2TxData } from './arbitrumL2';
import type { OptimisticL2BatchDataContainer, OptimisticL2BlobTypeEip4844, OptimisticL2BlobTypeCelestia } from './optimisticL2';
import type { TokenInfo } from './token';
import type { TokenTransfer } from './tokenTransfer';
import type { ZkSyncBatchesItem } from './zkSyncL2';

export type BlockType = 'block' | 'reorg' | 'uncle';

export interface BlockBaseFeeCelo {
  amount: string;
  breakdown: Array<{ amount: string; percentage: number; address: AddressParam }>;
  recipient: AddressParam;
  token: TokenInfo;
}

export interface Block {
  height: number;
  timestamp: string;
  tx_count: number;
  miner: AddressParam;
  size: number;
  hash: string;
  parent_hash: string;
  difficulty: string;
  total_difficulty: string | null;
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
  // BLOB FIELDS
  blob_gas_price?: string;
  blob_gas_used?: string;
  burnt_blob_fees?: string;
  excess_blob_gas?: string;
  blob_tx_count?: number;
  // ZKSYNC FIELDS
  zksync?: Omit<ZkSyncBatchesItem, 'number' | 'tx_count' | 'timestamp'> & {
    'batch_number': number | null;
  };
  arbitrum?: ArbitrumBlockData;
  optimism?: OptimismBlockData;
  // CELO FIELDS
  celo?: {
    epoch_number: number;
    is_epoch_block: boolean;
    base_fee?: BlockBaseFeeCelo;
  };
}

type ArbitrumBlockData = {
  'batch_number': number;
  'commitment_transaction': ArbitrumL2TxData;
  'confirmation_transaction': ArbitrumL2TxData;
  'delayed_messages': number;
  'l1_block_height': number;
  'send_count': number;
  'send_root': string;
  'status': ArbitrumBatchStatus;
}

export interface OptimismBlockData {
  batch_data_container: OptimisticL2BatchDataContainer;
  internal_id: number;
  blobs: Array<OptimisticL2BlobTypeEip4844> | Array<OptimisticL2BlobTypeCelestia> | null;
  l1_timestamp: string;
  l1_tx_hashes: Array<string>;
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
  } | null;
}

export type BlockWithdrawalsItem = {
  amount: string;
  index: number;
  receiver: AddressParam;
  validator_index: number;
}

export interface BlockCountdownResponse {
  result: {
    CountdownBlock: string;
    CurrentBlock: string;
    EstimateTimeInSec: string;
    RemainingBlock: string;
  } | null;
}

export interface BlockEpochElectionReward {
  count: number;
  token: TokenInfo<'ERC-20'>;
  total: string;
}

export type EpochRewardsType = 'group' | 'validator' | 'delegated_payment' | 'voter';

export interface BlockEpoch {
  number: number;
  distribution: {
    carbon_offsetting_transfer: TokenTransfer | null;
    community_transfer: TokenTransfer | null;
    reserve_bolster_transfer: TokenTransfer | null;
  };
  aggregated_election_rewards: Record<EpochRewardsType, BlockEpochElectionReward | null>;
}

export interface BlockEpochElectionRewardDetails {
  account: AddressParam;
  amount: string;
  associated_account: AddressParam;
}

export interface BlockEpochElectionRewardDetailsResponse {
  items: Array<BlockEpochElectionRewardDetails>;
  next_page_params: null;
}
