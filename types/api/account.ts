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
  _native?: NotificationDirection;
  erc20?: NotificationDirection;
  erc7211155?: NotificationDirection;
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
  email?: string;
}

export interface WatchlistAddress {
  addressHash: string;
  addressName: string;
  addressBalance: number;
  coinName: string;
  exchangeRate?: number;
  notificationSettings: NotificationSettings;
}

export interface WatchlistAddressNew {
  addressName: string;
  notificationSettings: NotificationSettings;
}

export type WatchlistAddresses = Array<WatchlistAddress>

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
