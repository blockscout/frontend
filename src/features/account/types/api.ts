// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Abi } from 'viem';

import type { schemas } from '@blockscout/api-types';

export interface TransactionsResponseWatchlist {
  items: Array<schemas['Transaction']>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: 50;
  } | null;
}
export interface AddressTag {
  address_hash: string;
  address: schemas['Address'];
  name: string;
  id: number;
}

export type AddressTags = Array<AddressTag>;

export type AddressTagsResponse = {
  items: AddressTags;
  next_page_params: {
    id: number;
    items_count: number;
  } | null;
};

export interface ApiKey {
  api_key: string;
  name: string;
}

export type ApiKeys = Array<ApiKey>;

export interface ModelError {
  message: string;
}

export interface NotificationDirection {
  incoming: boolean;
  outcoming: boolean;
}

export interface NotificationSettings {
  'native': NotificationDirection;
  'ERC-20': NotificationDirection;
  'ERC-721': NotificationDirection;
  'ERC-404': NotificationDirection;
  [key: string]: NotificationDirection;
}

export interface NotificationMethods {
  email: boolean;
}

export interface TransactionTag {
  transaction_hash: string;
  name: string;
  id: number;
}

export type TransactionTags = Array<TransactionTag>;

export type TransactionTagsResponse = {
  items: TransactionTags;
  next_page_params: {
    id: number;
    items_count: number;
  } | null;
};

export interface UserInfo {
  name?: string;
  nickname?: string;
  email: string | null;
  address_hash: string | null;
  avatar?: string;
}

export interface WatchlistAddress {
  address_hash: string;
  name: string;
  address_balance: string;
  exchange_rate: string;
  notification_settings: NotificationSettings;
  notification_methods: NotificationMethods;
  id: number;
  address: schemas['Address'];
  tokens_count: number;
  tokens_fiat_value: string;
  tokens_overflow: boolean;
}

export interface WatchlistAddressNew {
  addressName: string;
  notificationSettings: NotificationSettings;
}

export type WatchlistAddresses = Array<WatchlistAddress>;

export type WatchlistResponse = {
  items: WatchlistAddresses;
  next_page_params: {
    id: number;
    items_count: number;
  } | null;
};

export type CustomAbis = Array<CustomAbi>;

export interface CustomAbi {
  name: string;
  id: number;
  contract_address_hash: string;
  contract_address: schemas['Address'];
  abi: Abi;
}

export type WatchlistErrors = {
  address_hash?: Array<string>;
  name?: Array<string>;
  watchlist_id?: Array<string>;
};

export type CustomAbiErrors = {
  address_hash?: Array<string>;
  name?: Array<string>;
  abi?: Array<string>;
  identity_id?: Array<string>;
};

export type ApiKeyErrors = {
  name?: Array<string>;
  identity_id?: Array<string>;
};

export type AddressTagErrors = {
  address_hash: Array<string>;
  name: Array<string>;
  identity_id?: Array<string>;
};

export type TransactionTagErrors = {
  transaction_hash: Array<string>;
  name: Array<string>;
  identity_id?: Array<string>;
};
