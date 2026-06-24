// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as bens from '@blockscout/bens-types';

export interface SearchResultDomain {
  type: 'ens_domain';
  name: string | null;
  address_hash: string | null;
  is_smart_contract_verified: boolean;
  is_smart_contract_address: boolean;
  certified?: boolean;
  filecoin_robust_address?: string | null;
  url?: string;
  ens_info: {
    address_hash: string | null;
    expiry_date?: string;
    name: string;
    names_count: number;
    protocol?: bens.ProtocolInfo;
    protocol_dapp_logo?: string;
    protocol_dapp_url?: string;
  };
  priority: number;
  reputation: 'ok' | 'warning' | 'error';
}
export interface EnsAddressLookupFilters extends Pick<bens.LookupAddressRequest, 'address' | 'resolved_to' | 'owned_by' | 'only_active'> {
  protocols: Array<string> | undefined;
}

export interface EnsDomainLookupFilters extends Pick<bens.LookupDomainNameRequest, 'name' | 'only_active'> {
  protocols: Array<string> | undefined;
}

export interface EnsLookupSorting {
  sort: 'registration_date';
  order: Exclude<bens.Order, bens.Order.ORDER_UNSPECIFIED | bens.Order.UNRECOGNIZED>;
}

export type EnsDomainLookupFiltersOptions = Array<'resolved_to' | 'owned_by' | 'with_inactive'>;
