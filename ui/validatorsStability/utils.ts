import type {
  ValidatorsStabilitySortingValue,
  ValidatorsStabilitySortingField,
} from 'types/api/validators';
import type { SelectOption } from 'ui/shared/select/types';

export const VALIDATORS_STABILITY_SORT_OPTIONS: Array<SelectOption<ValidatorsStabilitySortingValue>> = [
  { label: 'Default', value: undefined },
  { label: 'Status descending', value: 'state-desc' },
  { label: 'Status ascending', value: 'state-asc' },
  { label: 'Blocks validated descending', value: 'blocks_validated-desc' },
  { label: 'Blocks validated ascending', value: 'blocks_validated-asc' },
];

export const VALIDATORS_STABILITY_SORT_SEQUENCE: Record<ValidatorsStabilitySortingField, Array<ValidatorsStabilitySortingValue | undefined>> = {
  state: [ 'state-desc', 'state-asc', undefined ],
  blocks_validated: [ 'blocks_validated-desc', 'blocks_validated-asc', undefined ],
};
