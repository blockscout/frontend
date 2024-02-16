import type { AddressParam } from './addressParams';

export interface Validator {
  address: AddressParam;
  blocks_validated_count: number;
  state: 'active' | 'probation' | 'inactive';
}

export interface ValidatorsResponse {
  items: Array<Validator>;
  next_page_params: null;
}

export interface ValidatorsFilters {
  address_hash: string | undefined;
  state: Validator['state'] | undefined;
}

export interface ValidatorsSorting {
  sort: 'state' | 'blocks_validated';
  order: 'asc' | 'desc';
}

export type ValidatorsSortingField = ValidatorsSorting['sort'];

export type ValidatorsSortingValue = `${ ValidatorsSortingField }-${ ValidatorsSorting['order'] }`;
