import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';
import type { Option } from 'ui/shared/sort/Sort';

export type SortField = 'registration_date';
export type Sort = `${ SortField }-asc` | `${ SortField }-desc`;

export const SORT_OPTIONS: Array<Option<Sort>> = [
  { title: 'Default', id: undefined },
  { title: 'Registered on descending', id: 'registration_date-desc' },
  { title: 'Registered on ascending', id: 'registration_date-asc' },
];

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  registration_date: [ 'registration_date-desc', 'registration_date-asc', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);
