import type {
  ValidatorsStabilitySortingValue,
  ValidatorsStabilitySortingField,
} from 'types/api/validators';

import type { TOption } from 'ui/shared/sort/Option';

export const VALIDATORS_STABILITY_SORT_OPTIONS: Array<TOption<ValidatorsStabilitySortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Status descending', id: 'state-desc' },
  { title: 'Status ascending', id: 'state-asc' },
  { title: 'Blocks validated descending', id: 'blocks_validated-desc' },
  { title: 'Blocks validated ascending', id: 'blocks_validated-asc' },
];

export const VALIDATORS_STABILITY_SORT_SEQUENCE: Record<ValidatorsStabilitySortingField, Array<ValidatorsStabilitySortingValue | undefined>> = {
  state: [ 'state-desc', 'state-asc', undefined ],
  blocks_validated: [ 'blocks_validated-desc', 'blocks_validated-asc', undefined ],
};
