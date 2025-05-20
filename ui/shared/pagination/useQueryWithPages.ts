import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { clamp, omit } from 'es-toolkit';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import type { PaginationParams } from './types';

import type { Route } from 'nextjs-routes';

import getResourceParams from 'lib/api/getResourceParams';
import type { PaginatedResourceName, PaginationFilters, PaginationSorting, ResourceError, ResourcePayload } from 'lib/api/resources';
import { SORTING_FIELDS } from 'lib/api/resources';
import type { Params as UseApiQueryParams } from 'lib/api/useApiQuery';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

export interface Params<Resource extends PaginatedResourceName> {
  resourceName: Resource;
  options?: UseApiQueryParams<Resource>['queryOptions'];
  pathParams?: UseApiQueryParams<Resource>['pathParams'];
  filters?: PaginationFilters<Resource>;
  sorting?: PaginationSorting<Resource>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

type NextPageParams = Record<string, unknown>;

const INITIAL_PAGE_PARAMS = { '1': {} };

function getPageFromQuery(query: Route['query']) {
  return query?.page && !Array.isArray(query.page) ? Number(query.page) : 1;
}

function getPaginationParamsFromQuery(queryString: string | Array<string> | undefined) {
  if (queryString) {
    try {
      return JSON.parse(decodeURIComponent(getQueryParamString(queryString))) as NextPageParams;
    } catch (error) {}
  }

  return {};
}

function getNextPageParams<R extends PaginatedResourceName>(data: ResourcePayload<R> | undefined) {
  if (!data || typeof data !== 'object' || !('next_page_params' in data)) {
    return;
  }

  return data.next_page_params;
}

export type QueryWithPagesResult<Resource extends PaginatedResourceName> =
UseQueryResult<ResourcePayload<Resource>, ResourceError<unknown>> &
{
  onFilterChange: <R extends PaginatedResourceName = Resource>(filters: PaginationFilters<R>) => void;
  onSortingChange: (sorting?: PaginationSorting<Resource>) => void;
  pagination: PaginationParams;
};

export default function useQueryWithPages<Resource extends PaginatedResourceName>({
  resourceName,
  filters,
  sorting,
  options,
  pathParams,
  scrollRef,
}: Params<Resource>): QueryWithPagesResult<Resource> {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [ page, setPage ] = React.useState<number>(getPageFromQuery(router.query));
  const [ pageParams, setPageParams ] = React.useState<Record<number, NextPageParams>>({
    [page]: getPaginationParamsFromQuery(router.query.next_page_params),
  });
  const [ hasPages, setHasPages ] = React.useState(page > 1);

  const isMounted = React.useRef(false);
  const queryParams = { ...pageParams[page], ...filters, ...sorting };

  const scrollToTop = useCallback(() => {
    scrollRef?.current ? scrollRef.current.scrollIntoView(true) : animateScroll.scrollToTop({ duration: 0 });
  }, [ scrollRef ]);

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams: Object.keys(queryParams).length ? queryParams : undefined,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
  });
  const { data } = queryResult;
  const nextPageParams = getNextPageParams(data);

  const onNextPageClick = useCallback(() => {
    if (!nextPageParams) {
      // we hide next page button if no next_page_params
      return;
    }

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
  }, [ nextPageParams, page, router, scrollToTop ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query = { ...router.query };
    if (page === 2) {
      nextPageQuery = omit(router.query, [ 'next_page_params', 'page' ]);
    } else {
      nextPageQuery.next_page_params = encodeURIComponent(JSON.stringify(pageParams[page - 1]));
      nextPageQuery.page = String(page - 1);
    }

    scrollToTop();
    setPage(prev => clamp(prev - 1, 1, Infinity));
    page === 2 && queryClient.removeQueries({ queryKey: [ resourceName ] });
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true });
  }, [ router, page, pageParams, scrollToTop, queryClient, resourceName ]);

  const resetPage = useCallback(() => {
    queryClient.removeQueries({ queryKey: [ resourceName ] });

    scrollToTop();
    const nextRouterQuery = omit(router.query, [ 'next_page_params', 'page' ]);
    router.push({ pathname: router.pathname, query: nextRouterQuery }, undefined, { shallow: true }).then(() => {
      queryClient.removeQueries({ queryKey: [ resourceName ] });
      setPage(1);
      setPageParams(INITIAL_PAGE_PARAMS);
      window.setTimeout(() => {
        // FIXME after router is updated we still have inactive queries for previously visited page (e.g third), where we came from
        // so have to remove it but with some delay :)
        queryClient.removeQueries({ queryKey: [ resourceName ], type: 'inactive' });
      }, 100);
    });
  }, [ queryClient, resourceName, router, scrollToTop ]);

  const onFilterChange = useCallback(<R extends PaginatedResourceName = Resource>(newFilters: PaginationFilters<R> | undefined) => {
    const { resource } = getResourceParams(resourceName);
    const newQuery: typeof router.query = omit(
      router.query,
      [
        'next_page_params',
        'page',
        ...(resource.filterFields || []),
      ],
    );
    if (newFilters) {
      Object.entries(newFilters).forEach(([ key, value ]) => {
        const isValidValue = typeof value === 'boolean' || (value && value.length);
        if (isValidValue) {
          newQuery[key] = Array.isArray(value) ? value.join(',') : (String(value) || '');
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
      setPageParams(INITIAL_PAGE_PARAMS);
    });
  }, [ router, resourceName, scrollToTop ]);

  const onSortingChange = useCallback((newSorting: PaginationSorting<Resource> | undefined) => {
    const newQuery: typeof router.query = {
      ...omit(router.query, [ 'next_page_params', 'page', ...SORTING_FIELDS ]),
      ...newSorting,
    };
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
      setPageParams(INITIAL_PAGE_PARAMS);
    });
  }, [ router, scrollToTop ]);

  const hasNextPage = nextPageParams ? Object.keys(nextPageParams).length > 0 : false;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    hasPages,
    hasNextPage,
    canGoBackwards: Boolean(pageParams[page - 1]),
    isLoading: queryResult.isPlaceholderData,
    isVisible: hasPages || hasNextPage,
  };

  React.useEffect(() => {
    if (page !== 1 && isMounted.current) {
      queryClient.cancelQueries({ queryKey: [ resourceName ] });
      setPage(1);
    }
  // hook should run only when queryName has changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ resourceName ]);

  React.useEffect(() => {
    window.setTimeout(() => {
      isMounted.current = true;
    }, 0);
  }, []);

  React.useEffect(() => {
    const pageFromQuery = getPageFromQuery(router.query);
    const nextPageParamsFromQuery = getPaginationParamsFromQuery(router.query.next_page_params);

    setPage(pageFromQuery);
    setPageParams(prev => ({
      ...prev,
      [pageFromQuery]: nextPageParamsFromQuery,
    }));
    setHasPages(pageFromQuery > 1);
  }, [ router.query ]);

  return { ...queryResult, pagination, onFilterChange, onSortingChange };
}
