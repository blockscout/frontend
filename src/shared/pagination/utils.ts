// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PaginationParams } from './types';

import type { PaginatedResourceName, PaginatedResourceResponse, PaginatedResourceResponseItems } from 'src/api/resources';

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

export const emptyPagination: PaginationParams = {
  page: 1,
  onNextPageClick: () => {},
  onPrevPageClick: () => {},
  resetPage: () => {},
  hasPages: false,
  hasNextPage: false,
  canGoBackwards: false,
  isLoading: false,
  isVisible: false,
};
