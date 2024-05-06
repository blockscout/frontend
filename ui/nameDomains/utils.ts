import type { EnsLookupSorting } from 'types/api/ens';

import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';
import type { Option } from 'ui/shared/sort/Sort';

export type SortField = EnsLookupSorting['sort'];
export type Sort = `${ EnsLookupSorting['sort'] }-${ EnsLookupSorting['order'] }`;

export const SORT_OPTIONS: Array<Option<Sort>> = [
  { title: 'Default', id: undefined },
  { title: 'Registered on descending', id: 'registration_date-DESC' },
  { title: 'Registered on ascending', id: 'registration_date-ASC' },
];

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  registration_date: [ 'registration_date-DESC', 'registration_date-ASC', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);
