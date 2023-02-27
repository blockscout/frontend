import type { AddressParam } from './addressParams';
import type { TokenInfo } from './token';
import type { TokenTotal } from './tokenTransfer';

export type TxStateChange = (TxStateChangeCoin | TxStateChangeToken) & {
  address: AddressParam;
  token: TokenInfo | null;
  is_miner: boolean;
  balance_before: string | null;
  balance_after: string | null;
  storage: Array<unknown> | null;
}

export interface TxStateChangeCoin {
  type: 'coin';
  change: string;
}

export interface TxStateChangeToken {
  type: 'token';
  change: {
    direction: 'from' | 'to';
    total: TokenTotal;
  };
}

export type TxStateChanges = Array<TxStateChange>;
