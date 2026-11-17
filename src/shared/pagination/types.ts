// SPDX-License-Identifier: LicenseRef-Blockscout

export type NextPageParams = Record<string, unknown>;

export interface PaginationParams {
  readonly page: number;
  readonly onNextPageClick: () => void;
  readonly onPrevPageClick: () => void;
  readonly resetPage: () => void;
  readonly hasPages: boolean;
  readonly hasNextPage: boolean;
  readonly canGoBackwards: boolean;
  readonly isLoading: boolean;
  readonly isVisible: boolean;
}
