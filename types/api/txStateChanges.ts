import type { AddressParam } from './addressParams';
import type { TokenInfo } from './token';
import type { Erc1155TotalPayload, Erc721TotalPayload } from './tokenTransfer';

export type TxStateChange = (TxStateChangeCoin | TxStateChangeToken) & {
  address: AddressParam;
  is_miner: boolean;
  balance_before: string | null;
  balance_after: string | null;
}

export interface TxStateChangeCoin {
  type: 'coin';
  change: string;
  token: null;
}

export type TxStateChangeToken = TxStateChangeTokenErc20 | TxStateChangeTokenErc721 | TxStateChangeTokenErc1155;

type ChangeDirection = 'from' | 'to';

export interface TxStateChangeTokenErc20 {
  type: 'token';
  token: TokenInfo<'ERC-20'>;
  change: string;
}

export interface TxStateChangeTokenErc721 {
  type: 'token';
  token: TokenInfo<'ERC-721'>;
  change: Array<{
    direction: ChangeDirection;
    total: Erc721TotalPayload;
  }>;
}

export type TxStateChangeTokenErc1155 = TxStateChangeTokenErc1155Single | TxStateChangeTokenErc1155Batch;

export interface TxStateChangeTokenErc1155Single {
  type: 'token';
  token: TokenInfo<'ERC-1155'>;
  change: Array<{
    direction: ChangeDirection;
    total: Erc1155TotalPayload;
  }>;
}

export interface TxStateChangeTokenErc1155Batch {
  type: 'token';
  token: TokenInfo<'ERC-1155'>;
  change: Array<{
    direction: ChangeDirection;
    total: Array<Erc1155TotalPayload>;
  }>;
}

export type TxStateChanges = Array<TxStateChange>;
