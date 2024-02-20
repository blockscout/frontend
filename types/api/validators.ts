import type { AddressParam } from './addressParams';

export interface Validator {
  address: AddressParam;
  blocks_validated_count: number;
  state: 'active' | 'probation' | 'inactive';
}

export interface ValidatorsResponse {
  items: Array<Validator>;
  next_page_params: {
    'address_hash': string;
    'blocks_validated': string;
    'items_count': string;
    'state': Validator['state'];
  } | null;
}

export interface ValidatorsCountersResponse {
  active_validators_counter: string;
  active_validators_percentage: number;
  new_validators_counter_24h: string;
  validators_counter: string;
}

export interface ValidatorsFilters {
  // address_hash: string | undefined; // right now API doesn't support filtering by address_hash
  state_filter: Validator['state'] | undefined;
}

export interface ValidatorsSorting {
  sort: 'state' | 'blocks_validated';
  order: 'asc' | 'desc';
}

export type ValidatorsSortingField = ValidatorsSorting['sort'];

export type ValidatorsSortingValue = `${ ValidatorsSortingField }-${ ValidatorsSorting['order'] }`;
