// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { NftTokenType, TokenType } from 'src/slices/token/types/api';

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

export interface AddressTransactionsSocketMessage {
  transactions: Array<schemas['Transaction']>;
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
