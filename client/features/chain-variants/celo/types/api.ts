// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';
import type { TokenInfo } from 'client/slices/token/types/api';
import type { CeloEpochRewardsType } from 'types/api/epochs';

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
