// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export const UNKNOWN_ADDRESS: Omit<schemas['Address'], 'hash'> = {
  is_contract: false,
  is_verified: false,
  implementations: [],
  name: '',
  private_tags: [],
  public_tags: [],
  watchlist_names: [],
  ens_domain_name: null,
  is_scam: false,
  metadata: null,
  proxy_type: null,
  reputation: 'ok',
};
