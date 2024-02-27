import type { Query } from 'nextjs-routes';

import type { Option } from 'ui/shared/sort/Sort';

export default function getSortValueFromQuery<SortValue extends string>(query: Query, sortOptions: Array<Option<SortValue>>) {
  if (!query.sort || !query.order) {
    return undefined;
  }

  const str = query.sort + '-' + query.order;
  if (sortOptions.map(option => option.id).includes(str as SortValue)) {
    return str as SortValue;
  }
}
