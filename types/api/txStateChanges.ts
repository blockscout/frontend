import type { AddressParam } from './addressParams';
import type { TokenInfo } from './token';
import type { Erc1155TotalPayload, Erc721TotalPayload } from './tokenTransfer';

export type TxStateChange = (TxStateChangeCoin | TxStateChangeToken) & {
  address: AddressParam;
  is_miner: boolean;
  balance_before: string | null;
  balance_after: string | null;
  storage: Array<unknown> | null;
}

export interface TxStateChangeCoin {
  type: 'coin';
  change: string;
  token: null;
}

export type TxStateChangeToken = TxStateChangeTokenErc20 | TxStateChangeTokenErc721 | TxStateChangeTokenErc1155;

type NftTokenChange<T> = {
  direction: 'from' | 'to';
  total: T;
}

export interface TxStateChangeTokenErc20 {
  type: 'token';
  token: TokenInfo<'ERC-20'>;
  change: string;
}

export interface TxStateChangeTokenErc721 {
  type: 'token';
  token: TokenInfo<'ERC-721'>;
  change: Array<NftTokenChange<Erc721TotalPayload>>;
}

export interface TxStateChangeTokenErc1155 {
  type: 'token';
  token: TokenInfo<'ERC-1155'>;
  change: Array<NftTokenChange<Erc1155TotalPayload | Array<Erc1155TotalPayload>>>;
}

export type TxStateChanges = Array<TxStateChange>;
