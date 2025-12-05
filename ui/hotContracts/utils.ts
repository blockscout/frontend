import type { HotContractsSortingValue, HotContractsSortingField } from 'types/api/contracts';

import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<HotContractsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Txs count descending', value: 'transactions_count-desc' },
  { label: 'Txs count ascending', value: 'transactions_count-asc' },
  { label: 'Gas used descending', value: 'total_gas_used-desc' },
  { label: 'Gas used ascending', value: 'total_gas_used-asc' },
];

export const SORT_SEQUENCE: Record<HotContractsSortingField, Array<HotContractsSortingValue>> = {
  transactions_count: [ 'transactions_count-desc', 'transactions_count-asc', 'default' ],
  total_gas_used: [ 'total_gas_used-desc', 'total_gas_used-asc', 'default' ],
};
