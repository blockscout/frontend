// SPDX-License-Identifier: LicenseRef-Blockscout

export type NextPageParams = Record<string, unknown>;

export interface PaginationParams {
  page: number;
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  resetPage: () => void;
  hasPages: boolean;
  hasNextPage: boolean;
  canGoBackwards: boolean;
  isLoading: boolean;
  isVisible: boolean;
}
