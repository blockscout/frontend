import type {
  ValidatorsBlackfortSortingValue,
  ValidatorsBlackfortSortingField,
} from 'types/api/validators';
import type { SelectOption } from 'ui/shared/select/types';

export const VALIDATORS_BLACKFORT_SORT_OPTIONS: Array<SelectOption<ValidatorsBlackfortSortingValue>> = [
  { label: 'Default', value: undefined },
  { label: 'Address descending', value: 'address_hash-desc' },
  { label: 'Address ascending', value: 'address_hash-asc' },
];

export const VALIDATORS_BLACKFORT_SORT_SEQUENCE: Record<ValidatorsBlackfortSortingField, Array<ValidatorsBlackfortSortingValue | undefined>> = {
  address_hash: [ 'address_hash-desc', 'address_hash-asc', undefined ],
};
