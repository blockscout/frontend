// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { NftTokenType, TokenType } from 'src/slices/token/types/api';
import type { Transaction } from 'src/slices/tx/types/api';

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

export interface AddressTokensBalancesSocketMessage {
  overflow: boolean;
  token_balances: Array<schemas['TokenBalance']>;
}

export interface AddressCoinBalanceSocketMessage {
  coin_balance: schemas['CoinBalance'];
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

export type AddressTokenTransferFilters = {
  filter?: AddressFromToFilter;
  type?: Array<TokenType>;
  token?: string;
};

export type AddressTokensFilter = {
  type: TokenType | Array<TokenType>;
};

export type AddressNFTTokensFilter = {
  type: Array<NftTokenType> | undefined;
};

export type AddressXStarResponse = {
  data: {
    level: string | null;
  };
};
