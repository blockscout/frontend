// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as bens from '@blockscout/bens-types';

export interface SearchResultDomain {
  type: 'ens_domain';
  name: string | null;
  address_hash: string | null;
  is_smart_contract_verified: boolean;
  is_smart_contract_address: boolean;
  certified?: true;
  filecoin_robust_address?: string | null;
  url?: string;
  ens_info: {
    address_hash: string | null;
    expiry_date?: string;
    name: string;
    names_count: number;
    protocol?: bens.ProtocolInfo;
  };
}
