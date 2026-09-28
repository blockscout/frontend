// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SelectOption } from 'src/toolkit/chakra/select';

import type { Sort, SortField } from '../../utils/utils';

export const SORT_OPTIONS: Array<SelectOption<Sort>> = [
  { label: 'Default', value: 'default' },
  { label: 'Value descending', value: 'value-desc' },
  { label: 'Value ascending', value: 'value-asc' },
  { label: 'Gas limit descending', value: 'gas-limit-desc' },
  { label: 'Gas limit ascending', value: 'gas-limit-asc' },
];

export const SORT_SEQUENCE: Record<SortField, Array<Sort>> = {
  value: [ 'value-desc', 'value-asc', 'default' ],
  'gas-limit': [ 'gas-limit-desc', 'gas-limit-asc', 'default' ],
};
