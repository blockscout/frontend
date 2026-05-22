// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PaginatedResourceName, PaginatedResourceResponse, PaginatedResourceResponseItems } from 'client/api/resources';

export function generateListStub<Resource extends PaginatedResourceName>(
  stub: (PaginatedResourceResponseItems<Resource>)[number],
  num = 50,
  rest: Omit<PaginatedResourceResponse<Resource>, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
