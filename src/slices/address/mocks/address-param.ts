import type { schemas } from '@blockscout/api-types';

export const hash = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

export const withName: schemas['Address'] = {
  hash: hash,
  implementations: [],
  is_contract: false,
  is_verified: null,
  name: 'ArianeeStore',
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
  ens_domain_name: null,
  is_scam: false,
  metadata: null,
  proxy_type: null,
  reputation: 'ok',
};

export const withEns: schemas['Address'] = {
  hash: hash,
  implementations: [],
  is_contract: false,
  is_verified: null,
  name: 'ArianeeStore',
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
  ens_domain_name: 'kitty.kitty.kitty.cat.eth',
  is_scam: false,
  metadata: null,
  proxy_type: null,
  reputation: 'ok',
};

export const withNameTag: schemas['Address'] = {
  hash: hash,
  implementations: [],
  is_contract: false,
  is_verified: null,
  name: 'ArianeeStore',
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
  ens_domain_name: 'kitty.kitty.kitty.cat.eth',
  metadata: {
    tags: [
      { tagType: 'name', name: 'Mrs. Duckie', slug: 'mrs-duckie', ordinal: 0, meta: {} },
    ],
  },
  is_scam: false,
  proxy_type: null,
  reputation: 'ok',
};

export const withoutName: schemas['Address'] = {
  hash: hash,
  implementations: [],
  is_contract: false,
  is_verified: null,
  name: null,
  private_tags: [],
  watchlist_names: [],
  public_tags: [],
  ens_domain_name: null,
  is_scam: false,
  metadata: null,
  proxy_type: null,
  reputation: 'ok',
};

export const contract: schemas['Address'] = {
  ...withoutName,
  is_contract: true,
  is_verified: true,
  name: 'EternalStorageProxy',
  implementations: [
    { address_hash: '0x2F4F4A52295940C576417d29F22EEb92B440eC89', name: 'HomeBridge' },
  ],
};

export const delegated: schemas['Address'] = {
  ...withoutName,
  is_verified: true,
  proxy_type: 'eip7702',
};

export const filecoin: schemas['Address'] = {
  ...withoutName,
  filecoin: {
    robust: '0x1234567890123456789012345678901234567890',
    actor_type: 'evm' as const,
    id: '1234567890123456789012345678901234567890',
  },
};
