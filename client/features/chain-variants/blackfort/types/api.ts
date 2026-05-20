// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export interface ValidatorBlackfort {
  address: AddressParam;
  name: string;
  commission: number;
  delegated_amount: string;
  self_bonded_amount: string;
}

export interface ValidatorsBlackfortResponse {
  items: Array<ValidatorBlackfort>;
  next_page_params: {
    address_hash: string;
  } | null;
}

export interface ValidatorsBlackfortCountersResponse {
  new_validators_count_24h: string;
  validators_count: string;
}

export interface ValidatorsBlackfortSorting {
  sort: 'address_hash';
  order: 'asc' | 'desc';
}

export type ValidatorsBlackfortSortingField = ValidatorsBlackfortSorting['sort'];

export type ValidatorsBlackfortSortingValue = `${ ValidatorsBlackfortSortingField }-${ ValidatorsBlackfortSorting['order'] }` | 'default';
