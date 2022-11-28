import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pick, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import { PAGINATION_FIELDS } from 'types/api/pagination';
import type { PaginationParams, PaginatedResponse, PaginatedQueryKeys, PaginationFilters } from 'types/api/pagination';

import useFetch from 'lib/hooks/useFetch';

interface Params<QueryName extends PaginatedQueryKeys> {
  apiPath: string;
  queryName: QueryName;
  queryIds?: Array<string>;
  filters?: PaginationFilters<QueryName>;
  options?: Omit<UseQueryOptions<unknown, unknown, PaginatedResponse<QueryName>>, 'queryKey' | 'queryFn'>;
}

export default function useQueryWithPages<QueryName extends PaginatedQueryKeys>({ queryName, filters, options, apiPath, queryIds }: Params<QueryName>) {
  const paginationFields = PAGINATION_FIELDS[queryName];
  const queryClient = useQueryClient();
  const router = useRouter();
  const [ page, setPage ] = React.useState(1);
  const currPageParams = pick(router.query, paginationFields);
  const [ pageParams, setPageParams ] = React.useState<Array<PaginationParams<QueryName>>>([ ]);
  const fetch = useFetch();

  const queryResult = useQuery<unknown, unknown, PaginatedResponse<QueryName>>(
    [ queryName, ...(queryIds || []), { page, filters } ],
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
    { staleTime: Infinity, ...options },
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
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        animateScroll.scrollToTop({ duration: 0 });
        setPage(prev => prev + 1);
      });
  }, [ data?.next_page_params, page, pageParams.length, router ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query;
    if (page === 2) {
      nextPageQuery = omit(router.query, paginationFields);
    } else {
      const nextPageParams = { ...pageParams[page - 2] };
      nextPageQuery = { ...router.query };
      nextPageParams && Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
    }
    router.query = nextPageQuery;
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        animateScroll.scrollToTop({ duration: 0 });
        setPage(prev => prev - 1);
        page === 2 && queryClient.clear();
      });
  }, [ router, page, paginationFields, pageParams, queryClient ]);

  const resetPage = useCallback(() => {
    queryClient.clear();
    router.push({ pathname: router.pathname, query: omit(router.query, paginationFields) }, undefined, { shallow: true }).then(() => {
      animateScroll.scrollToTop({ duration: 0 });
      setPage(1);
      setPageParams([ ]);
    });
  }, [ queryClient, router, paginationFields ]);

  const hasPaginationParams = Object.keys(currPageParams).length > 0;
  const nextPageParams = data?.next_page_params;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    hasPaginationParams,
    resetPage,
    hasNextPage: nextPageParams ? Object.keys(nextPageParams).length > 0 : false,
  };

  return { ...queryResult, pagination };
}
