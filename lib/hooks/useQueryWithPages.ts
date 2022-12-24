import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pick, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll, scroller } from 'react-scroll';

import { PAGINATION_FIELDS, PAGINATION_FILTERS_FIELDS } from 'types/api/pagination';
import type { PaginationParams, PaginatedResponse, PaginatedQueryKeys, PaginationFilters } from 'types/api/pagination';

import useFetch from 'lib/hooks/useFetch';

interface Params<QueryName extends PaginatedQueryKeys> {
  apiPath: string;
  queryName: QueryName;
  queryIds?: Array<string>;
  filters?: PaginationFilters<QueryName>;
  options?: Omit<UseQueryOptions<unknown, unknown, PaginatedResponse<QueryName>>, 'queryKey' | 'queryFn'>;
  scroll?: { elem: string; offset: number };
}

export default function useQueryWithPages<QueryName extends PaginatedQueryKeys>({
  queryName,
  filters,
  options,
  apiPath,
  queryIds,
  scroll,
}: Params<QueryName>) {
  const paginationFields = PAGINATION_FIELDS[queryName];
  const queryClient = useQueryClient();
  const router = useRouter();
  const [ page, setPage ] = React.useState<number>(router.query.page && !Array.isArray(router.query.page) ? Number(router.query.page) : 1);
  const currPageParams = pick(router.query, paginationFields);
  const [ pageParams, setPageParams ] = React.useState<Array<PaginationParams<QueryName>>>([ ]);
  const fetch = useFetch();
  const isMounted = React.useRef(false);
  const canGoBackwards = React.useRef(!router.query.page);
  const [ hasPagination, setHasPagination ] = React.useState(page > 1);

  const queryKey = [ queryName, ...(queryIds || []), { page, filters } ];

  const scrollToTop = useCallback(() => {
    scroll ? scroller.scrollTo(scroll.elem, { offset: scroll.offset }) : animateScroll.scrollToTop({ duration: 0 });
  }, [ scroll ]);

  const queryResult = useQuery<unknown, unknown, PaginatedResponse<QueryName>>(
    queryKey,
    async() => {
      const params: Array<string> = [];

      Object.entries({ ...filters, ...currPageParams }).forEach(([ key, val ]) => {
        if (Array.isArray(val)) {
          val.length && params.push(`${ key }=${ val.join(',') }`);
        } else if (val) {
          params.push(`${ key }=${ val }`);
        }
      });

      return fetch(`${ apiPath }${ params.length ? '?' + params.join('&') : '' }`);
    },
    { staleTime: page === 1 ? 0 : Infinity, ...options },
  );
  const { data } = queryResult;

  const onNextPageClick = useCallback(() => {
    if (!data?.next_page_params) {
      // we hide next page button if no next_page_params
      return;
    }
    const nextPageParams = data.next_page_params;
    if (page >= pageParams.length && data?.next_page_params) {
      setPageParams(prev => [ ...prev, nextPageParams ]);
    }
    const nextPageQuery = { ...router.query };
    Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
    nextPageQuery.page = String(page + 1);
    setHasPagination(true);

    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        scrollToTop();
        setPage(prev => prev + 1);
      });
  }, [ data?.next_page_params, page, pageParams.length, router, scrollToTop ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query = { ...router.query };
    if (page === 2) {
      nextPageQuery = omit(router.query, paginationFields, 'page');
      canGoBackwards.current = true;
    } else {
      const nextPageParams = { ...pageParams[page - 2] };
      nextPageParams && Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
      nextPageQuery.page = String(page - 1);
    }
    router.query = nextPageQuery;
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        scrollToTop();
        setPage(prev => prev - 1);
        page === 2 && queryClient.removeQueries({ queryKey: [ queryName ] });
      });
    setHasPagination(true);
  }, [ router, page, paginationFields, pageParams, queryClient, scrollToTop, queryName ]);

  const resetPage = useCallback(() => {
    queryClient.removeQueries({ queryKey: [ queryName ] });

    router.push({ pathname: router.pathname, query: omit(router.query, paginationFields, 'page') }, undefined, { shallow: true }).then(() => {
      queryClient.removeQueries({ queryKey: [ queryName ] });
      scrollToTop();
      setPage(1);
      setPageParams([ ]);
      canGoBackwards.current = true;
      window.setTimeout(() => {
        // FIXME after router is updated we still have inactive queries for previously visited page (e.g third), where we came from
        // so have to remove it but with some delay :)
        queryClient.removeQueries({ queryKey: [ queryName ], type: 'inactive' });
      }, 100);
    });

    setHasPagination(true);
  }, [ queryClient, queryName, router, paginationFields, scrollToTop ]);

  const onFilterChange = useCallback((newFilters: PaginationFilters<QueryName> | undefined) => {
    const newQuery = omit(router.query, PAGINATION_FIELDS[queryName], 'page', PAGINATION_FILTERS_FIELDS[queryName]);
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
      setPageParams([ ]);
      scrollToTop();
    });
  }, [ queryName, router, scrollToTop, setPageParams, setPage ]);

  const hasPaginationParams = Object.keys(currPageParams).length > 0;
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
      queryClient.cancelQueries({ queryKey });
      setPage(1);
    }
  // hook should run only when queryName has changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ queryName ]);

  React.useEffect(() => {
    window.setTimeout(() => {
      isMounted.current = true;
    }, 0);
  }, []);

  return { ...queryResult, pagination, onFilterChange, isPaginationVisible };
}
