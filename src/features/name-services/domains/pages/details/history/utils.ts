// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as bens from '@blockscout/bens-types';

import getNextSortValueShared from 'src/shared/sort/get-next-sort-value';
import { collator } from 'src/shared/texts/collator';

export type SortField = 'timestamp';
export type Sort = `${ SortField }-asc` | `${ SortField }-desc` | 'default';

const SORT_SEQUENCE: Record<SortField, Array<Sort>> = {
  timestamp: [ 'timestamp-desc', 'timestamp-asc', 'default' ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

export const sortFn = (sort: Sort | undefined) => (a: bens.DomainEvent, b: bens.DomainEvent) => {
  switch (sort) {
    case 'timestamp-asc': {
      return collator.compare(b.timestamp, a.timestamp);
    }

    case 'timestamp-desc': {
      return collator.compare(a.timestamp, b.timestamp);
    }

    default:
      return 0;
  }
};
