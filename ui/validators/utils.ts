import type { ValidatorsSortingValue, ValidatorsSortingField } from 'types/api/validators';

import type { Option } from 'ui/shared/sort/Sort';

export const SORT_OPTIONS: Array<Option<ValidatorsSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Status descending', id: 'state-desc' },
  { title: 'Status ascending', id: 'state-asc' },
  { title: 'Blocks validated descending', id: 'blocks_validated-desc' },
  { title: 'Blocks validated ascending', id: 'blocks_validated-asc' },
];

export const SORT_SEQUENCE: Record<ValidatorsSortingField, Array<ValidatorsSortingValue | undefined>> = {
  state: [ 'state-desc', 'state-asc', undefined ],
  blocks_validated: [ 'blocks_validated-desc', 'blocks_validated-asc', undefined ],
};
