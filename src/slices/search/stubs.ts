import type { SearchResultItem } from './types/api';

import { ADDRESS_HASH } from 'src/slices/address/stubs/address-params';

export const SEARCH_RESULT_ITEM: SearchResultItem = {
  address_hash: ADDRESS_HASH,
  address_url: '/address/0x3714A8C7824B22271550894f7555f0a672f97809',
  name: 'USDC',
  symbol: 'USDC',
  token_url: '/token/0x3714A8C7824B22271550894f7555f0a672f97809',
  type: 'token',
  icon_url: null,
  is_verified_via_admin_panel: false,
  is_smart_contract_verified: false,
  is_smart_contract_address: false,
  exchange_rate: '1.11',
  total_supply: null,
  token_type: 'ERC-20',
  reputation: 'ok',
  certified: false,
  circulating_market_cap: null,
  priority: 0,
};
