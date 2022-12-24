import { useQueryClient } from '@tanstack/react-query';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll, scroller } from 'react-scroll';

import type { PaginatedResponseX, PaginatedResources, PaginationFiltersX } from 'types/api/pagination';

import { RESOURCES } from 'lib/api/resources';
import type { Params as UseApiQueryParams } from 'lib/api/useApiQuery';
import useApiQuery from 'lib/api/useApiQuery';

interface Params<Resource extends PaginatedResources> {
  resourceName: Resource;
  options?: UseApiQueryParams<Resource>['queryOptions'];
  pathParams?: Record<string, string>;
  filters?: PaginationFiltersX<Resource>;
  scroll?: { elem: string; offset: number };
}

export default function useQueryWithPages<Resource extends PaginatedResources>({
  resourceName,
  filters,
  options,
  pathParams,
  scroll,
}: Params<Resource>) {
  const resource = RESOURCES[resourceName];
  const queryClient = useQueryClient();
  const router = useRouter();

  type NextPageParams = {
    [K in keyof PaginatedResponseX<Resource>['next_page_params']]: string;
  }
  const currPageParams = mapValues(pick(router.query, resource.paginationFields), (value) => value?.toString()) as NextPageParams;

  const [ page, setPage ] = React.useState<number>(router.query.page && !Array.isArray(router.query.page) ? Number(router.query.page) : 1);
  const [ pageParams, setPageParams ] = React.useState<Record<number, NextPageParams>>({
    [page]: currPageParams,
  });
  const [ hasPagination, setHasPagination ] = React.useState(page > 1);

  const isMounted = React.useRef(false);
  const canGoBackwards = React.useRef(!router.query.page);
  const queryParams = { ...filters, ...pageParams[page] };

  const scrollToTop = useCallback(() => {
    scroll ? scroller.scrollTo(scroll.elem, { offset: scroll.offset }) : animateScroll.scrollToTop({ duration: 0 });
  }, [ scroll ]);

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
  });
  const { data } = queryResult;

  const onNextPageClick = useCallback(() => {
    if (!data?.next_page_params) {
      // we hide next page button if no next_page_params
      return;
    }
    const nextPageParams = data.next_page_params;

    setPageParams((prev) => ({
      ...prev,
      [page + 1]: mapValues(nextPageParams, (value) => value?.toString()) as NextPageParams,
    }));
    setPage(prev => prev + 1);

    const nextPageQuery = { ...router.query };
    Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
    nextPageQuery.page = String(page + 1);
    setHasPagination(true);

    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        scrollToTop();
      });
  }, [ data?.next_page_params, page, router, scrollToTop ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query = { ...router.query };
    if (page === 2) {
      nextPageQuery = omit(router.query, resource.paginationFields, 'page');
      canGoBackwards.current = true;
    } else {
      const nextPageParams = pageParams[page - 1];
      nextPageParams && Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = String(val));
      nextPageQuery.page = String(page - 1);
    }

    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        scrollToTop();
        setPage(prev => prev - 1);
        page === 2 && queryClient.removeQueries({ queryKey: [ resourceName ] });
      });
    setHasPagination(true);
  }, [ router, page, resource.paginationFields, pageParams, scrollToTop, queryClient, resourceName ]);

  const resetPage = useCallback(() => {
    queryClient.removeQueries({ queryKey: [ resourceName ] });

    router.push({ pathname: router.pathname, query: omit(router.query, resource.paginationFields, 'page') }, undefined, { shallow: true }).then(() => {
      queryClient.removeQueries({ queryKey: [ resourceName ] });
      scrollToTop();
      setPage(1);
      setPageParams({});
      canGoBackwards.current = true;
      window.setTimeout(() => {
        // FIXME after router is updated we still have inactive queries for previously visited page (e.g third), where we came from
        // so have to remove it but with some delay :)
        queryClient.removeQueries({ queryKey: [ resourceName ], type: 'inactive' });
      }, 100);
    });

    setHasPagination(true);
  }, [ queryClient, resourceName, router, resource.paginationFields, scrollToTop ]);

  const onFilterChange = useCallback((newFilters: PaginationFiltersX<Resource> | undefined) => {
    const newQuery = omit(router.query, resource.paginationFields, 'page', resource.filterFields);
    if (newFilters) {
      Object.entries(newFilters).forEach(([ key, value ]) => {
        if (value && value.length) {
          newQuery[key] = Array.isArray(value) ? value.join(',') : (value || '');
        }
      });
    }
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    ).then(() => {
      setPage(1);
      setPageParams({});
      scrollToTop();
    });
  }, [ router, resource.paginationFields, resource.filterFields, scrollToTop ]);

  const hasPaginationParams = Object.keys(currPageParams || {}).length > 0;
  const nextPageParams = data?.next_page_params;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    hasPaginationParams,
    resetPage,
    hasNextPage: nextPageParams ? Object.keys(nextPageParams).length > 0 : false,
    canGoBackwards: canGoBackwards.current,
  };

  const isPaginationVisible = hasPagination || (!queryResult.isLoading && !queryResult.isError && pagination.hasNextPage);

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

  return { ...queryResult, pagination, onFilterChange, isPaginationVisible };
}
