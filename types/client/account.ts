import type { WatchlistAddress } from '../api/account';

export type TWatchlistItem = WatchlistAddress & {tokens_count: number};

export type TWatchlist = Array<TWatchlistItem>;

export interface CsrfData {
  token: string;
}
