import type { ArrayElement } from 'types/utils';

import type {
  PaginatedResources,
  PaginatedResourcesOfBool,
  PaginatedResponse,
  ResourcePayloadOfBool,
} from 'lib/api/resources';

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

export function generateListStubOfBool<
  Resource extends PaginatedResourcesOfBool
>(
  stub: ArrayElement<ResourcePayloadOfBool<Resource>['items']>,
  num = 50,
  rest: Omit<ResourcePayloadOfBool<Resource>, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
