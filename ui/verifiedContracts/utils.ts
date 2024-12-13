import type { VerifiedContractsSortingValue, VerifiedContractsSortingField } from 'types/api/verifiedContracts';
import type { SelectOption } from 'ui/shared/select/types';

export const SORT_OPTIONS: Array<SelectOption<VerifiedContractsSortingValue>> = [
  { label: 'Default', value: undefined },
  { label: 'Balance descending', value: 'balance-desc' },
  { label: 'Balance ascending', value: 'balance-asc' },
  { label: 'Txs count descending', value: 'txs_count-desc' },
  { label: 'Txs count ascending', value: 'txs_count-asc' },
];

export const SORT_SEQUENCE: Record<VerifiedContractsSortingField, Array<VerifiedContractsSortingValue | undefined>> = {
  balance: [ 'balance-desc', 'balance-asc', undefined ],
  txs_count: [ 'txs_count-desc', 'txs_count-asc', undefined ],
};
