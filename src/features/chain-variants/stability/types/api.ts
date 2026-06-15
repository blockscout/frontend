// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface TransactionStability {
  stability_fee?: {
    dapp_address: schemas['Address'];
    dapp_fee: string;
    token: schemas['Token'];
    total_fee: string;
    validator_address: schemas['Address'];
    validator_fee: string;
  };
}

export interface ValidatorStability {
  address: schemas['Address'];
  blocks_validated_count: number;
  state: 'active' | 'probation' | 'inactive';
}

export interface ValidatorsStabilityResponse {
  items: Array<ValidatorStability>;
  next_page_params: {
    address_hash: string;
    blocks_validated: string;
    items_count: string;
    state: ValidatorStability['state'];
  } | null;
}

export interface ValidatorsStabilityCountersResponse {
  active_validators_count: string;
  active_validators_percentage: number;
  new_validators_count_24h: string;
  validators_count: string;
}

export interface ValidatorsStabilityFilters {
  // address_hash: string | undefined; // right now API doesn't support filtering by address_hash
  state_filter: ValidatorStability['state'] | undefined;
}

export interface ValidatorsStabilitySorting {
  sort: 'state' | 'blocks_validated';
  order: 'asc' | 'desc';
}

export type ValidatorsStabilitySortingField = ValidatorsStabilitySorting['sort'];

export type ValidatorsStabilitySortingValue = `${ ValidatorsStabilitySortingField }-${ ValidatorsStabilitySorting['order'] }` | 'default';
