import type { OptimisticL2WithdrawalsResponse } from 'types/api/optimisticL2';

export const data: OptimisticL2WithdrawalsResponse = {
  items: [
    {
      challenge_period_end: null,
      from: {
        hash: '0x67aab90c548b284be30b05c376001b4db90b87ba',
        implementations: null,
        is_contract: false,
        is_verified: false,
        name: null,
        private_tags: [],
        public_tags: [],
        watchlist_names: [],
        ens_domain_name: null,
      },
      l1_tx_hash: '0x1a235bee32ac10cb7efdad98415737484ca66386e491cde9e17d42b136dca684',
      l2_timestamp: '2022-02-15T12:50:02.000000Z',
      l2_tx_hash: '0x918cd8c5c24c17e06cd02b0379510c4ad56324bf153578fb9caaaa2fe4e7dc35',
      msg_nonce: 396,
      msg_nonce_version: 1,
      status: 'Ready to prove',
    },
    {
      challenge_period_end: null,
      from: null,
      l1_tx_hash: null,
      l2_timestamp: null,
      l2_tx_hash: '0x2f117bee32ac10cb7efdad98415737484ca66386e491cde9e17d42b136def593',
      msg_nonce: 391,
      msg_nonce_version: 1,
      status: 'Ready to prove',
    },
    {
      challenge_period_end: '2022-11-11T12:50:02.000000Z',
      from: null,
      l1_tx_hash: null,
      l2_timestamp: null,
      l2_tx_hash: '0xe14b1f46838176702244a5343629bcecf728ca2d9881d47b4ce46e00c387d7e3',
      msg_nonce: 390,
      msg_nonce_version: 1,
      status: 'Ready for relay',
    },
  ],
  next_page_params: {
    items_count: 50,
    nonce: '1766847064778384329583297500742918515827483896875618958121606201292620123',
  },
};
