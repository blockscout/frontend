import type { ArrayElement } from 'types/utils';

import type { PaginatedResources, PaginatedResponse, PaginatedResponseItems } from 'lib/api/resources';

export function generateListStub<Resource extends PaginatedResources>(
  stub: ArrayElement<PaginatedResponseItems<Resource>>,
  num = 50,
  rest: Omit<PaginatedResponse<Resource>, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
