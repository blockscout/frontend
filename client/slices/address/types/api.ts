// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataTagApi } from 'client/features/address-metadata/types/api';
import type { AddressFilecoinParams } from 'client/features/chain-variants/filecoin/types/api';
import type { AddressZilliqaParams } from 'client/features/chain-variants/zilliqa/types/api';
import type { Block } from 'client/slices/block/types/api';
import type { SmartContractCreationStatus, SmartContractProxyType } from 'client/slices/contract/types/api';
import type { InternalTransaction } from 'client/slices/internal-tx/types/api';
import type { TokenTransfer, TokenTransferPagination } from 'client/slices/token-transfer/types/api';
import type { NFTTokenType, TokenInfo, TokenInstance, TokenReputation, TokenType } from 'client/slices/token/types/api';
import type { Transaction } from 'client/slices/tx/types/api';

export interface AddressImplementation {
  address_hash: string;
  filecoin_robust_address?: string | null;
  name?: string | null;
}

export interface AddressTag {
  label: string;
  display_name: string;
  address_hash: string;
}

export interface WatchlistName {
  label: string;
  display_name: string;
}

export interface UserTags {
  private_tags: Array<AddressTag> | null;
  watchlist_names: Array<WatchlistName> | null;
  public_tags: Array<AddressTag> | null;
}

export type AddressParamBasic = {
  hash: string;
  implementations: Array<AddressImplementation> | null;
  name: string | null;
  is_contract: boolean;
  is_verified: boolean | null;
  ens_domain_name: string | null;
  metadata?: {
    reputation: number | null;
    tags: Array<AddressMetadataTagApi>;
  } | null;
  filecoin?: AddressFilecoinParams;
  proxy_type?: SmartContractProxyType | null;
  reputation?: TokenReputation;
};

export type AddressParam = UserTags & AddressParamBasic;

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

export interface Address extends UserTags {
  block_number_balance_updated_at: number | null;
  coin_balance: string | null;
  creator_address_hash: string | null;
  creator_filecoin_robust_address?: string | null;
  creation_transaction_hash: string | null;
  creation_status: SmartContractCreationStatus | null;
  exchange_rate: string | null;
  ens_domain_name: string | null;
  filecoin?: AddressFilecoinParams;
  zilliqa?: AddressZilliqaParams;
  celo?: AddressCeloParams;
  // TODO: if we are happy with tabs-counters method, should we delete has_something fields?
  has_beacon_chain_withdrawals?: boolean;
  has_logs: boolean;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: boolean;
  hash: string;
  implementations: Array<AddressImplementation> | null;
  is_contract: boolean;
  is_verified: boolean;
  name: string | null;
  token: TokenInfo | null;
  watchlist_address_id: number | null;
  proxy_type?: SmartContractProxyType | null;
}

export interface AddressCounters {
  transactions_count: string;
  token_transfers_count: string;
  gas_usage_count: string | null;
  validations_count: string | null;
}

export interface AddressTokenBalance {
  token: TokenInfo;
  token_id: string | null;
  value: string | null;
  token_instance: TokenInstance | null;
}
export type AddressTokenBalancesResponse = Array<AddressTokenBalance>;

export type AddressNFT = TokenInstance & {
  token: TokenInfo;
  token_type: Omit<TokenType, 'ERC-20'>;
  value: string;
};

export type AddressCollection = {
  token: TokenInfo;
  amount: string;
  token_instances: Array<Omit<AddressNFT, 'token'>>;
};

export interface AddressTokensResponse {
  items: Array<AddressTokenBalance>;
  next_page_params: {
    items_count: number;
    token_name: string | null;
    token_type: TokenType;
    value: number;
    fiat_value: string | null;
  } | null;
}

export interface AddressNFTsResponse {
  items: Array<AddressNFT>;
  next_page_params: {
    items_count: number;
    token_id: string;
    token_type: TokenType;
    token_contract_address_hash: string;
  } | null;
}

export interface AddressCollectionsResponse {
  items: Array<AddressCollection>;
  next_page_params: {
    token_contract_address_hash: string;
    token_type: TokenType;
  } | null;
}

export interface AddressTokensBalancesSocketMessage {
  overflow: boolean;
  token_balances: Array<AddressTokenBalance>;
}

export interface AddressTransactionsResponse {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

export const AddressFromToFilterValues = [ 'from', 'to' ] as const;

export type AddressFromToFilter = typeof AddressFromToFilterValues[number] | undefined;

export type AddressTxsFilters = {
  filter: AddressFromToFilter;
};

export interface AddressTokenTransferResponse {
  items: Array<TokenTransfer>;
  next_page_params: TokenTransferPagination | null;
}

export type AddressTokenTransferFilters = {
  filter?: AddressFromToFilter;
  type?: Array<TokenType>;
  token?: string;
};

export type AddressTokensFilter = {
  type: TokenType | Array<TokenType>;
};

export type AddressNFTTokensFilter = {
  type: Array<NFTTokenType> | undefined;
};

export interface AddressCoinBalanceHistoryItem {
  block_number: number;
  block_timestamp: string;
  delta: string;
  transaction_hash: string | null;
  value: string;
}

export interface AddressCoinBalanceHistoryResponse {
  items: Array<AddressCoinBalanceHistoryItem>;
  next_page_params: {
    block_number: number;
    items_count: number;
  } | null;
}

export type AddressCoinBalanceHistoryChart = {
  items: Array<{
    date: string;
    value: string;
  }>;
  days: number;
};

export interface AddressBlocksValidatedResponse {
  items: Array<Block>;
  next_page_params: {
    block_number: number;
    items_count: number;
  };
}
export interface AddressInternalTxsResponse {
  items: Array<InternalTransaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
    transaction_index: number;
  } | null;
}

export type AddressWithdrawalsResponse = {
  items: Array<AddressWithdrawalsItem>;
  next_page_params: {
    index: number;
    items_count: number;
  };
};

export type AddressWithdrawalsItem = {
  amount: string;
  block_number: number;
  index: number;
  timestamp: string;
  validator_index: number;
};

export type AddressTabsCounters = {
  internal_transactions_count: number | null;
  logs_count: number | null;
  token_balances_count: number | null;
  token_transfers_count: number | null;
  transactions_count: number | null;
  validations_count: number | null;
  withdrawals_count: number | null;
  beacon_deposits_count: number | null;
  celo_election_rewards_count?: number | null;
};

export type AddressXStarResponse = {
  data: {
    level: string | null;
  };
};

export type AddressesItem = AddressParam & { transactions_count: string; coin_balance: string | null };

export type AddressesResponse = {
  items: Array<AddressesItem>;
  next_page_params: {
    fetched_coin_balance: string;
    hash: string;
    items_count: number;
  } | null;
  total_supply: string;
};
