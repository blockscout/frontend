import type { ArrayElement } from 'types/utils';

import type { PaginatedResources, PaginatedResponse } from 'lib/api/resources';

export function generateListStub<Resource extends PaginatedResources>(
  stub: ArrayElement<PaginatedResponse<Resource>['items']>,
  num = 50,
  rest: Omit<PaginatedResponse<Resource>, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
