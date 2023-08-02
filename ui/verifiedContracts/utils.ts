import type { VerifiedContract } from 'types/api/contracts';

import compareBns from 'lib/bigint/compareBns';
import { default as getNextSortValueShared } from 'ui/shared/sort/getNextSortValue';
import type { Option } from 'ui/shared/sort/Sort';

export type SortField = 'balance' | 'txs';
export type Sort = `${ SortField }-asc` | `${ SortField }-desc`;

export const SORT_OPTIONS: Array<Option<Sort>> = [
  { title: 'Default', id: undefined },
  { title: 'Balance descending', id: 'balance-desc' },
  { title: 'Balance ascending', id: 'balance-asc' },
  { title: 'Txs count descending', id: 'txs-desc' },
  { title: 'Txs count ascending', id: 'txs-asc' },
];

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  balance: [ 'balance-desc', 'balance-asc', undefined ],
  txs: [ 'txs-desc', 'txs-asc', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

export const sortFn = (sort: Sort | undefined) => (a: VerifiedContract, b: VerifiedContract) => {
  switch (sort) {
    case 'balance-asc':
    case 'balance-desc': {
      const result = compareBns(b.coin_balance, a.coin_balance) * (sort.includes('desc') ? 1 : -1);
      return a.coin_balance === b.coin_balance ? 0 : result;
    }

    case 'txs-asc':
    case 'txs-desc': {
      const result = ((a.tx_count || 0) > (b.tx_count || 0) ? -1 : 1) * (sort.includes('desc') ? 1 : -1);
      return a.tx_count === b.tx_count ? 0 : result;
    }

    default:
      return 0;
  }
};
