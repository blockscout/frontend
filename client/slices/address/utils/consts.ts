// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export const unknownAddress: Omit<AddressParam, 'hash'> = {
  is_contract: false,
  is_verified: false,
  implementations: null,
  name: '',
  private_tags: [],
  public_tags: [],
  watchlist_names: [],
  ens_domain_name: null,
};
