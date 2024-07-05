import type { VerifiedContractsSortingValue, VerifiedContractsSortingField } from 'types/api/verifiedContracts';

import type { TOption } from 'ui/shared/sort/Option';

export const SORT_OPTIONS: Array<TOption<VerifiedContractsSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Balance descending', id: 'balance-desc' },
  { title: 'Balance ascending', id: 'balance-asc' },
  { title: 'Txs count descending', id: 'txs_count-desc' },
  { title: 'Txs count ascending', id: 'txs_count-asc' },
];

export const SORT_SEQUENCE: Record<VerifiedContractsSortingField, Array<VerifiedContractsSortingValue | undefined>> = {
  balance: [ 'balance-desc', 'balance-asc', undefined ],
  txs_count: [ 'txs_count-desc', 'txs_count-asc', undefined ],
};
