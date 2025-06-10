import type { AddressParam } from './addressParams';
import type { TokenInfo } from './token';
import type { Erc20TotalPayload, TokenTransfer } from './tokenTransfer';

export type CeloEpochListItem = {
  number: number;
  start_block_number: number;
  end_block_number: number;
  timestamp: string;
  distribution: {
    carbon_offsetting_transfer: Erc20TotalPayload | null;
    community_transfer: Erc20TotalPayload | null;
    transfers_total: Erc20TotalPayload | null;
  } | null;
};

export type CeloEpochListResponse = {
  items: Array<CeloEpochListItem>;
  next_page_params: {
    items_count: number;
    number: number;
  } | null;
};

export type CeloEpochDetails = {
  number: number;
  timestamp: string;
  start_block_number: number;
  start_processing_block_hash: string;
  start_processing_block_number: number;
  end_block_number: number;
  end_processing_block_hash: string;
  end_processing_block_number: number;
  distribution: {
    carbon_offsetting_transfer: TokenTransfer | null;
    community_transfer: TokenTransfer | null;
    transfers_total: {
      token: TokenInfo<'ERC-20'> | null;
      total: Erc20TotalPayload | null;
    } | null;
  } | null;
  aggregated_election_rewards: Record<CeloEpochRewardsType, CeloEpochElectionReward | null> | null;
};

export interface CeloEpochElectionReward {
  count: number;
  token: TokenInfo<'ERC-20'>;
  total: string;
}

export type CeloEpochRewardsType = 'group' | 'validator' | 'delegated_payment' | 'voter';

export interface CeloEpochElectionRewardDetails {
  account: AddressParam;
  amount: string;
  associated_account: AddressParam;
}

export interface CeloEpochElectionRewardDetailsResponse {
  items: Array<CeloEpochElectionRewardDetails>;
  next_page_params: null;
}
