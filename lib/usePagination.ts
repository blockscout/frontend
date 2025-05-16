import { useState, useCallback } from 'react';

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

export function usePagination(
  hasNext: boolean,
  hasPrevious: boolean,
  loading: boolean,
  isVisible: boolean = true,
): PaginationParams {
  const [ page, setPage ] = useState<number>(1);

  const onNextPageClick = useCallback(() => {
    if (hasNext && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [ hasNext, loading ]);

  const onPrevPageClick = useCallback(() => {
    if (hasPrevious && !loading && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [ hasPrevious, loading, page ]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    hasPages: hasNext || hasPrevious,
    hasNextPage: hasNext,
    canGoBackwards: hasPrevious && page > 1,
    isLoading: loading,
    isVisible,
  };
}
