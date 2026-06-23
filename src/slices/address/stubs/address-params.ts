import type { schemas } from '@blockscout/api-types';

export const ADDRESS_HASH = '0x2B51Ae4412F79c3c1cB12AA40Ea4ECEb4e80511a';

export const ADDRESS_PARAMS: schemas['Address'] = {
  hash: ADDRESS_HASH,
  implementations: [],
  is_contract: false,
  is_verified: false,
  name: null,
  private_tags: [],
  public_tags: [],
  watchlist_names: [],
  ens_domain_name: null,
  is_scam: false,
  metadata: null,
  proxy_type: null,
  reputation: 'ok',
};
