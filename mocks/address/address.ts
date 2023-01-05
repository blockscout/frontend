import type { Address } from 'types/api/address';
import type { AddressParam } from 'types/api/addressParams';

import { tokenInfo } from 'mocks/tokens/tokenInfo';

export const withName: AddressParam = {
  hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
  implementation_name: null,
  is_contract: true,
  is_verified: null,
  name: 'ArianeeStore',
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
};

export const withoutName: AddressParam = {
  hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
  implementation_name: null,
  is_contract: true,
  is_verified: null,
  name: null,
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
};

export const withToken: Address = {
  hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
  implementation_name: null,
  is_contract: true,
  is_verified: false,
  name: null,
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
  token: tokenInfo,
  block_number_balance_updated_at: 8201413,
  coin_balance: '1',
  creation_tx_hash: null,
  creator_address_hash: null,
  exchange_rate: null,
  implementation_address: null,
};
