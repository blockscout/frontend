import type { PaginatedState } from './types';
import type { PaginationParams } from 'ui/shared/pagination/types';

export const calcForumPagination = (
  pageSize: number,
  page: number,
  setPage: (_page: number) => void,
  state: PaginatedState<unknown>,
): PaginationParams => {
  return {
    page,
    onNextPageClick: () => setPage(page + 1),
    onPrevPageClick: () => setPage(page - 1),
    resetPage: () => setPage(1),
    hasPages: state.data.count > pageSize,
    hasNextPage: state.data.count > pageSize * page,
    canGoBackwards: page > 1,
    isLoading: state.loading,
    isVisible: state.data.count > pageSize,
  };
};
