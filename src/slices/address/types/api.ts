// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { NftTokenType, TokenType } from 'src/slices/token/types/api';

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

export interface AddressTokenTransferSocketMessage {
  token_transfers: Array<schemas['TokenTransfer']>;
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
