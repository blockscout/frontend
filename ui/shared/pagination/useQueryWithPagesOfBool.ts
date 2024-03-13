import { useQueryClient } from '@tanstack/react-query';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import type {
  ApiResource,
  PaginatedResourcesOfBool,
  PaginationFilters,
  PaginationSorting } from 'lib/api/resources';
import {
  RESOURCES,
  SORTING_FIELDS,
} from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import type { Params as UseApiQueryParams } from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

export interface Params<Resource extends PaginatedResourcesOfBool> {
  resourceName: Resource;
  filters?: PaginationFilters<Resource>;
  options?: UseApiQueryParams<Resource>['queryOptions'];
  pathParams?: UseApiQueryParams<Resource>['pathParams'];
  scrollRef?: React.RefObject<HTMLDivElement>;
  sorting?: PaginationSorting<Resource>;
}

type NextPageParams = Record<string, any>;

function getPaginationParamsFromQuery(
  queryString: string | Array<string> | undefined,
) {
  if (queryString) {
    try {
      return JSON.parse(
        decodeURIComponent(getQueryParamString(queryString)),
      ) as NextPageParams;
    } catch (error) {}
  }

  return {};
}

export default function useQueryWithPagesOfBool<
  Resource extends PaginatedResourcesOfBool
>({
  resourceName,
  options,
  pathParams,
  scrollRef,
  filters,
  sorting,
}: Params<Resource>) {
  const resource = RESOURCES[resourceName] as ApiResource;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [ page, setPage ] = React.useState<number>(
    router.query.page && !Array.isArray(router.query.page) ?
      Number(router.query.page) :
      1,
  );
  const [ pageParams, setPageParams ] = React.useState<
  Record<number, NextPageParams>
  >({
    [page]: getPaginationParamsFromQuery(router.query.next_page_params),
  });
  const isMounted = React.useRef(false);
  const queryParams = {
    pageNo: 1,
    pageSize: 50,
    ...filters,
    ...sorting,
    ...pageParams[page],
  };

  const scrollToTop = useCallback(() => {
    scrollRef?.current ?
      scrollRef.current.scrollIntoView(true) :
      animateScroll.scrollToTop({ duration: 0 });
  }, [ scrollRef ]);

  const queryResult = useApiQuery(resourceName, {
    pathParams,
    queryParams: (Object.keys(queryParams).length ?
      queryParams :
      undefined) as any,
    queryOptions: {
      staleTime: page === 1 ? 0 : Infinity,
      ...options,
    },
  });
  const { data } = queryResult;

  const onNextPageClick = useCallback(() => {
    const _data: any = data;

    if (!_data?.totalCount) {
      // we hide next page button if no next_page_params
      return;
    }

    const pageParams = {
      pageNo: page + 1,
    };

    setPageParams((prev) => ({
      ...prev,
      [page + 1]: pageParams as NextPageParams,
    }));
    setPage((prev) => prev + 1);

    const nextPageQuery = {
      ...router.query,
      page: String(page + 1),
      next_page_params: encodeURIComponent(JSON.stringify(pageParams)),
    };

    scrollToTop();

    router.push(
      { pathname: router.pathname, query: nextPageQuery },
      undefined,
      { shallow: true },
    );
  }, [ data, page, router, scrollToTop ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query = { ...router.query };
    if (page === 2) {
      nextPageQuery = omit(router.query, [ 'next_page_params', 'page' ]);
    } else {
      nextPageQuery.next_page_params = encodeURIComponent(
        JSON.stringify(pageParams[page - 1]),
      );
      nextPageQuery.page = String(page - 1);
    }

    scrollToTop();
    router
      .push({ pathname: router.pathname, query: nextPageQuery }, undefined, {
        shallow: true,
      })
      .then(() => {
        setPage((prev) => prev - 1);
        page === 2 && queryClient.removeQueries({ queryKey: [ resourceName ] });
      });
  }, [ router, page, pageParams, scrollToTop, queryClient, resourceName ]);

  const resetPage = useCallback(() => {
    queryClient.removeQueries({ queryKey: [ resourceName ] });
    scrollToTop();
    const nextRouterQuery = omit(router.query, [ 'next_page_params', 'page' ]);
    router
      .push({ pathname: router.pathname, query: nextRouterQuery }, undefined, {
        shallow: true,
      })
      .then(() => {
        queryClient.removeQueries({ queryKey: [ resourceName ] });
        setPage(1);
        setPageParams({});
        window.setTimeout(() => {
          // FIXME after router is updated we still have inactive queries for previously visited page (e.g third), where we came from
          // so have to remove it but with some delay :)
          queryClient.removeQueries({
            queryKey: [ resourceName ],
            type: 'inactive',
          });
        }, 100);
      });
  }, [ queryClient, resourceName, router, scrollToTop ]);

  const onFilterChange = useCallback(
    <R extends PaginatedResourcesOfBool = Resource>(
      newFilters: PaginationFilters<R> | undefined,
    ) => {
      const newQuery = omit<typeof router.query>(
        router.query,
        'next_page_params',
        'page',
        resource.filterFields ?? [],
      );

      if (newFilters) {
        Object.entries(newFilters).forEach(([ key, value ]) => {
          const isValidValue =
            typeof value === 'boolean' || (value && value.length);
          if (isValidValue) {
            newQuery[key] = Array.isArray(value) ?
              value.join(',') :
              String(value) || '';
          }
        });
      }
      scrollToTop();
      router
        .push(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true },
        )
        .then(() => {
          setPage(1);
          setPageParams({});
        });
    },
    [ router, resource.filterFields, scrollToTop ],
  );

  const onSortingChange = useCallback(
    (newSorting: PaginationSorting<Resource> | undefined) => {
      const newQuery = {
        ...omit<typeof router.query>(
          router.query,
          'next_page_params',
          'page',
          SORTING_FIELDS,
        ),
        ...newSorting,
      };
      scrollToTop();
      router
        .push(
          {
            pathname: router.pathname,
            query: newQuery as any,
          },
          undefined,
          { shallow: true },
        )
        .then(() => {
          setPage(1);
          setPageParams({});
        });
    },
    [ router, scrollToTop ],
  );

  const nextPageParams: any = (data as any)?.totalCount ?
    data :
    undefined;
  const hasNextPage = nextPageParams ? nextPageParams.hasNext : false;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    resetPage,
    hasPages: Number(nextPageParams?.totalPage ?? 0) > 0,
    hasNextPage,
    canGoBackwards: page > 1,
    isLoading: queryResult.isPlaceholderData,
    isVisible: Number(nextPageParams?.totalPage ?? 0) > 0 || hasNextPage,
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

  return { ...queryResult, pagination, onFilterChange, onSortingChange };
}
