// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';
import type { Erc20TotalPayload, TokenTransfer } from 'client/slices/token-transfer/types/api';
import type { TokenInfo } from 'client/slices/token/types/api';

export interface TransactionCelo {
  celo?: {
    gas_token: TokenInfo | null;
  };
}

export interface BlockBaseFeeCelo {
  amount: string;
  breakdown: Array<{ amount: string; percentage: number; address: AddressParam }>;
  recipient: AddressParam;
  token: TokenInfo;
}

export interface BlockCelo {
  celo?: {
    epoch_number: number;
    l1_era_finalized_epoch_number: number | null;
    base_fee?: BlockBaseFeeCelo;
  };
}

export type CeloEpochType = 'L1' | 'L2';

export type CeloEpochListItem = {
  number: number;
  type: CeloEpochType;
  is_finalized: boolean;
  start_block_number: number;
  end_block_number: number | null;
  timestamp: string | null;
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
  type: CeloEpochType;
  is_finalized: boolean;
  timestamp: string | null;
  start_block_number: number;
  start_processing_block_hash: string | null;
  start_processing_block_number: number | null;
  end_block_number: number | null;
  end_processing_block_hash: string | null;
  end_processing_block_number: number | null;
  distribution: {
    carbon_offsetting_transfer: TokenTransfer | null;
    community_transfer: TokenTransfer | null;
    transfers_total: {
      token: TokenInfo | null;
      total: Erc20TotalPayload | null;
    } | null;
  } | null;
  aggregated_election_rewards: Record<CeloEpochRewardsType, CeloEpochElectionReward | null> | null;
};

export interface CeloEpochElectionReward {
  count: number;
  token: TokenInfo;
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

export type AddressEpochRewardsResponse = {
  items: Array<AddressEpochRewardsItem>;
  next_page_params: {
    amount: string;
    associated_account_address_hash: string;
    epoch_number: number;
    items_count: number;
    type: CeloEpochRewardsType;
  } | null;
};

export type AddressEpochRewardsItem = {
  type: CeloEpochRewardsType;
  token: TokenInfo;
  amount: string;
  block_timestamp: string;
  account: AddressParam;
  epoch_number: number;
  associated_account: AddressParam;
};
