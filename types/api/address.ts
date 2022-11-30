import type { AddressTag, WatchlistName } from './addressParams';
import type { TokenInfo } from './tokenInfo';

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
  tokenInfo: TokenInfo | null;
  watchlist_names: Array<WatchlistName> | null;
}
