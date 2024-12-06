import type { SelectOption } from 'ui/shared/select/types';

import type { Query } from 'nextjs-routes';

export default function getSortValueFromQuery<SortValue extends string>(query: Query, sortOptions: Array<SelectOption<SortValue>>) {
  if (!query.sort || !query.order) {
    return undefined;
  }

  const str = query.sort + '-' + query.order;
  if (sortOptions.map(option => option.value).includes(str as SortValue)) {
    return str as SortValue;
  }
}
