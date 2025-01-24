import type { EnsLookupSorting } from 'types/api/ens';
import type { SelectOption } from 'ui/shared/select/types';

import getNextSortValueShared from 'ui/shared/sort/getNextSortValue';

export type SortField = EnsLookupSorting['sort'];
export type Sort = `${ EnsLookupSorting['sort'] }-${ EnsLookupSorting['order'] }`;

export const SORT_OPTIONS: Array<SelectOption<Sort>> = [
  { label: 'Default', value: undefined },
  { label: 'Registered on descending', value: 'registration_date-DESC' },
  { label: 'Registered on ascending', value: 'registration_date-ASC' },
];

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  registration_date: [ 'registration_date-DESC', 'registration_date-ASC', undefined ],
};

export const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);
