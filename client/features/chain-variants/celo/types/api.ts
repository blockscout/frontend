import type { AddressParam } from 'client/slices/address/types/api';
import type { CeloEpochRewardsType } from 'types/api/epochs';
import type { TokenInfo } from 'types/api/token';

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

// ---- from types/api/address ----

export interface AddressCeloParams {
  account: {
    locked_celo: string;
    metadata_url: string | null;
    name: string | null;
    nonvoting_locked_celo: string;
    type: string;
    vote_signer_address: AddressParam | null;
    validator_signer_address: AddressParam | null;
    attestation_signer_address: AddressParam | null;
  } | null;
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
