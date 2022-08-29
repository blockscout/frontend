export interface AddressTag {
  address_hash: string;
  name: string;
  id: string;
}

export type AddressTags = Array<AddressTag>

export interface ApiKey {
  api_key: string;
  name: string;
}

export type ApiKeys = Array<ApiKey>

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
}

export interface NotificationMethods {
  email: boolean;
}

export interface Transaction {
  fromAddressHash?: string;
  toAddressHash?: string;
  createdContractAddressHash?: string;
}

export interface TransactionTag {
  transaction_hash: string;
  name: string;
  id: string;
}

export type TransactionTags = Array<TransactionTag>

export type Transactions = Array<Transaction>

export interface UserInfo {
  name?: string;
  nickname?: string;
  email: string;
  avatar?: string;
}

export interface WatchlistAddress {
  address_hash: string;
  name: string;
  address_balance: number;
  coin_name: string;
  exchange_rate: number;
  notification_settings: NotificationSettings;
  notification_methods: NotificationMethods;
  id: string;
}

export interface WatchlistAddressNew {
  addressName: string;
  notificationSettings: NotificationSettings;
}

export type WatchlistAddresses = Array<WatchlistAddress>

export interface PublicTag {
  website: string;
  tags: string; // tag_1;tag_2;tag_3 etc.
  is_owner: boolean;
  id: number;
  full_name: string;
  email: string;
  company: string;
  addresses: Array<string>;
  additional_comment: string;
}

export type PublicTagNew = Omit<PublicTag, 'id'>

export type PublicTags = Array<PublicTag>;

export type CustomAbis = Array<CustomAbi>

export interface CustomAbi {
  name: string;
  id: number;
  contract_address_hash: string;
  abi: Array<AbiItem>;
}

export interface AbiItem {
  type: 'function';
  stateMutability: 'nonpayable' | 'view';
  payable: boolean;
  outputs: Array<AbiInputOutput>;
  name: string;
  inputs: Array<AbiInputOutput>;
  constant: boolean;
}

interface AbiInputOutput {
  type: 'uint256';
  name: string;
}
