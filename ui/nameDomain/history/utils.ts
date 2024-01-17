import type { EnsDomainEvent } from 'types/api/ens';

import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';

export type SortField = 'timestamp';
export type Sort = `${ SortField }-asc` | `${ SortField }-desc`;

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  timestamp: [ 'timestamp-desc', 'timestamp-asc', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

export const sortFn = (sort: Sort | undefined) => (a: EnsDomainEvent, b: EnsDomainEvent) => {
  switch (sort) {
    case 'timestamp-asc': {
      return b.timestamp.localeCompare(a.timestamp);
    }

    case 'timestamp-desc': {
      return a.timestamp.localeCompare(b.timestamp);
    }

    default:
      return 0;
  }
};
