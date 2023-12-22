import type { EnsDomain } from 'types/api/ens';

import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';

export type SortField = 'registration_date';
export type Sort = `${ SortField }-asc` | `${ SortField }-desc`;

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  registration_date: [ 'registration_date-desc', 'registration_date-asc', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

export const sortFn = (sort: Sort | undefined) => (a: EnsDomain, b: EnsDomain) => {
  switch (sort) {
    case 'registration_date-asc': {
      if (!a.registrationDate) {
        return 1;
      }

      if (!b.registrationDate) {
        return -1;
      }

      return b.registrationDate?.localeCompare(a.registrationDate);
    }

    case 'registration_date-desc': {
      if (!a.registrationDate) {
        return -1;
      }

      if (!b.registrationDate) {
        return 1;
      }

      return a.registrationDate.localeCompare(b.registrationDate);
    }

    default:
      return 0;
  }
};
