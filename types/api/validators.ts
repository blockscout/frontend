import type { AddressParam } from './addressParams';

export interface ValidatorStability {
  address: AddressParam;
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
  active_validators_counter: string;
  active_validators_percentage: number;
  new_validators_counter_24h: string;
  validators_counter: string;
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

export type ValidatorsStabilitySortingValue = `${ ValidatorsStabilitySortingField }-${ ValidatorsStabilitySorting['order'] }`;

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
  new_validators_counter_24h: string;
  validators_counter: string;
}

export interface ValidatorsBlackfortSorting {
  sort: 'address_hash';
  order: 'asc' | 'desc';
}

export type ValidatorsBlackfortSortingField = ValidatorsBlackfortSorting['sort'];

export type ValidatorsBlackfortSortingValue = `${ ValidatorsBlackfortSortingField }-${ ValidatorsBlackfortSorting['order'] }`;
