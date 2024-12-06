import type {
  ValidatorsBlackfortSortingValue,
  ValidatorsBlackfortSortingField,
} from 'types/api/validators';

import type { TOption } from 'ui/shared/sort/Option';

export const VALIDATORS_BLACKFORT_SORT_OPTIONS: Array<TOption<ValidatorsBlackfortSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Address descending', id: 'address_hash-desc' },
  { title: 'Address ascending', id: 'address_hash-asc' },
];

export const VALIDATORS_BLACKFORT_SORT_SEQUENCE: Record<ValidatorsBlackfortSortingField, Array<ValidatorsBlackfortSortingValue | undefined>> = {
  address_hash: [ 'address_hash-desc', 'address_hash-asc', undefined ],
};
