import type { ArrayElement } from 'types/utils';

import type { PaginatedResources, PaginatedResponse } from 'lib/api/resources';

export function generateListStub<Resource extends PaginatedResources>(
  stub: ArrayElement<PaginatedResponse<Resource>['items']>,
  num = 50,
  pagination: PaginatedResponse<Resource>['next_page_params'] = null,
) {
  return {
    items: Array(num).fill(stub),
    next_page_params: pagination,
  };
}
