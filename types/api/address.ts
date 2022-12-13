import type { Transaction } from 'types/api/transaction';

import type { AddressTag, WatchlistName } from './addressParams';
import type { TokenInfo, TokenType } from './tokenInfo';
import type { TokenTransfer, TokenTransferPagination } from './tokenTransfer';

export interface Address {
  block_number_balance_updated_at: number | null;
  coin_balance: string | null;
  creator_address_hash: string | null;
  creation_tx_hash: string | null;
  exchange_rate: string | null;
  hash: string;
  implementation_address: string | null;
  implementation_name: string | null;
  is_contract: boolean;
  is_verified: boolean;
  name: string | null;
  private_tags: Array<AddressTag> | null;
  public_tags: Array<AddressTag> | null;
  token: TokenInfo | null;
  watchlist_names: Array<WatchlistName> | null;
}

export interface AddressCounters {
  transactions_count: string;
  token_transfers_count: string;
  gas_usage_count: string;
  validations_count: string | null;
}

export interface AddressTokenBalance {
  token: TokenInfo;
  token_id: string | null;
  value: string;
}

export interface AddressTransactionsResponse {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

type AddressFromToFilter = 'from' | 'to' | undefined;

export type AddressTxsFilters = {
  filter: AddressFromToFilter;
}

export interface AddressTokenTransferResponse {
  items: Array<TokenTransfer>;
  next_page_params: TokenTransferPagination | null;
}

export type AddressTokenTransferFilters = {
  filter: AddressFromToFilter;
  type: TokenType;
}

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
  };
}
