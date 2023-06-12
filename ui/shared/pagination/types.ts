export interface PaginationParams {
  page: number;
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  resetPage: () => void;
  hasNextPage: boolean;
  canGoBackwards: boolean;
  isLoading: boolean;
  isVisible: boolean;
}
