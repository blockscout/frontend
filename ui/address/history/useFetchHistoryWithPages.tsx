import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import queryString from 'querystring';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import type { AccountHistoryResponse, HistoryFilters } from 'types/translateApi';
import type { PaginationParams } from 'ui/shared/pagination/types';

import type { PaginatedResources, PaginationFilters, PaginationSorting } from 'lib/api/resources';
import getQueryParamString from 'lib/router/getQueryParamString';

import type { TranslateHistory } from './useFetchHistory';
import useFetchHistory from './useFetchHistory';

export interface Params<Resource extends PaginatedResources> {
  address: string;
  options?: Omit<UseQueryOptions<AccountHistoryResponse, TranslateHistory, AccountHistoryResponse>, 'queryKey' | 'queryFn'>;
  filters?: HistoryFilters;
  sorting?: PaginationSorting<Resource>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

type NextPageParams = Record<string, unknown>;

function getPaginationParamsFromQuery(queryString: string | Array<string> | undefined) {
  if (queryString) {
    try {
      return JSON.parse(decodeURIComponent(getQueryParamString(queryString))) as NextPageParams;
    } catch (error) {}
  }

  return {};
}

export type QueryWithPagesResult<Resource extends PaginatedResources> =
UseQueryResult<AccountHistoryResponse, TranslateHistory> &
{
  onFilterChange: (filters: PaginationFilters<Resource>) => void;
  pagination: PaginationParams;
}

export default function useFetchHistoryWithPages<Resource extends PaginatedResources>({
  address,
  filters,
  options,
  sorting,
  scrollRef,
}: Params<Resource>): QueryWithPagesResult<Resource> {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [ page, setPage ] = React.useState<number>(router.query.page && !Array.isArray(router.query.page) ? Number(router.query.page) : 1);
  const [ pageParams, setPageParams ] = React.useState<Record<number, NextPageParams>>({
    [page]: getPaginationParamsFromQuery(router.query.next_page_params),
  });
  const [ hasPages, setHasPages ] = React.useState(page > 1);

  const isMounted = React.useRef(false);
  const canGoBackwards = React.useRef(!router.query.page);
  const queryParams = React.useMemo(() => [ { ...pageParams[page], ...filters, ...sorting } ], [ pageParams, page, filters, sorting ])[0];

  const scrollToTop = useCallback(() => {
    scrollRef?.current ? scrollRef.current.scrollIntoView(true) : animateScroll.scrollToTop({ duration: 0 });
  }, [ scrollRef ]);

  const queryResult = useFetchHistory(address, page, {
    queryParams,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
  });
  const { data } = queryResult;

  const queryKey = React.useMemo(() => [ 'history', address, page, { ...queryParams } ], [ address, page, queryParams ]);

  const onNextPageClick = useCallback(() => {
    if (!data?.nextPageUrl) {
      // we hide next page button if no next_page_params
      return;
    }
    const pageQuery = data.nextPageUrl || '';
    const nextPageParams = queryString.parse(pageQuery.split('?').pop() || '');
    setPageParams((prev) => ({
      ...prev,
      [page + 1]: nextPageParams as NextPageParams,
    }));
    setPage(prev => prev + 1);

    const nextPageQuery = {
      ...router.query,
      page: String(page + 1),
      next_page_params: encodeURIComponent(JSON.stringify(nextPageParams)),
    };

    setHasPages(true);
    scrollToTop();
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true });
  }, [ data?.nextPageUrl, page, router, scrollToTop ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query = { ...router.query };
    if (page === 2) {
      nextPageQuery = omit(router.query, [ 'next_page_params', 'page' ]);
      canGoBackwards.current = true;
    } else {
      nextPageQuery.next_page_params = encodeURIComponent(JSON.stringify(pageParams[page - 1]));
      nextPageQuery.page = String(page - 1);
    }

    scrollToTop();
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        setPage(prev => prev - 1);
        page === 2 && queryClient.removeQueries({ queryKey });
      });
  }, [ pageParams, router, page, scrollToTop, queryClient, queryKey ]);

  const resetPage = useCallback(() => {
    queryClient.removeQueries({ queryKey });

    scrollToTop();
    const nextRouterQuery = omit(router.query, [ 'next_page_params', 'page' ]);
    router.push({ pathname: router.pathname, query: nextRouterQuery }, undefined, { shallow: true }).then(() => {
      queryClient.removeQueries({ queryKey });
      setPage(1);
      setPageParams({});
      canGoBackwards.current = true;
      window.setTimeout(() => {
        // FIXME after router is updated we still have inactive queries for previously visited page (e.g third), where we came from
        // so have to remove it but with some delay :)
        queryClient.removeQueries({ queryKey, type: 'inactive' });
      }, 100);
    });
  }, [ queryClient, router, scrollToTop, queryKey ]);

  const onFilterChange = useCallback((newFilters: PaginationFilters<Resource> | undefined) => {
    const newQuery = omit<typeof router.query>(router.query, 'next_page_params', 'page');
    if (newFilters) {
      Object.entries(newFilters).forEach(([ key, value ]) => {
        if (value && value.length) {
          newQuery[key] = Array.isArray(value) ? value.join(',') : (value || '');
        }
      });
    }
    scrollToTop();
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    ).then(() => {
      setHasPages(false);
      setPage(1);
      setPageParams({});
    });
  }, [ router, scrollToTop ]);

  const hasNextPage = data?.hasNextPage ? data.hasNextPage : false;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    hasPages,
    hasNextPage,
    canGoBackwards: canGoBackwards.current,
    isLoading: queryResult.isPlaceholderData,
    isVisible: hasPages || hasNextPage,
  };

  React.useEffect(() => {
    if (page !== 1 && isMounted.current) {
      queryClient.cancelQueries({ queryKey });
      setPage(1);
    }
  // hook should run only when queryName has changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ address ]);

  React.useEffect(() => {
    window.setTimeout(() => {
      isMounted.current = true;
    }, 0);
  }, []);

  return { ...queryResult, pagination, onFilterChange };
}
