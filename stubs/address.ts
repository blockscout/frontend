import type { Address } from 'types/api/address';

import { ADDRESS_HASH } from './addressParams';
import { TOKEN_INFO_ERC_20 } from './token';

export const ADDRESS_INFO: Address = {
  block_number_balance_updated_at: 8774377,
  coin_balance: '0',
  creation_tx_hash: null,
  creator_address_hash: null,
  exchange_rate: null,
  has_custom_methods_read: false,
  has_custom_methods_write: false,
  has_decompiled_code: false,
  has_logs: true,
  has_methods_read: false,
  has_methods_read_proxy: false,
  has_methods_write: false,
  has_methods_write_proxy: false,
  has_token_transfers: false,
  has_tokens: false,
  has_validated_blocks: false,
  hash: ADDRESS_HASH,
  implementation_address: null,
  implementation_name: null,
  is_contract: false,
  is_verified: false,
  name: 'ChainLink Token (goerli)',
  token: TOKEN_INFO_ERC_20,
  private_tags: [],
  public_tags: [],
  watchlist_names: [],
  watchlist_address_id: null,
};
