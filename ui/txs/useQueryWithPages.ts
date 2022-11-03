import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pick, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import type { TransactionsResponse } from 'types/api/transaction';
import type { TTxsFilters } from 'types/api/txsFilters';
import type { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';

const PAGINATION_FIELDS = [ 'block_number', 'index', 'items_count' ];

export default function useQueryWithPages(apiPath: string, queryName: QueryKeys, filters?: TTxsFilters) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [ page, setPage ] = React.useState(1);
  const currPageParams = pick(router.query, PAGINATION_FIELDS);
  const [ pageParams, setPageParams ] = React.useState<Array<Partial<TransactionsResponse['next_page_params']>>>([ {} ]);
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, TransactionsResponse>(
    [ queryName, { page, filters } ],
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
    { staleTime: Infinity },
  );

  const onNextPageClick = useCallback(() => {
    if (!data?.next_page_params) {
      // we hide next page button if no next_page_params
      return;
    }
    // api adds filters into next-page-params now
    // later filters will be removed from response
    const nextPageParams = pick(data.next_page_params, PAGINATION_FIELDS);
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
  }, [ data, page, pageParams, router ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    let nextPageQuery: typeof router.query;
    if (page === 2) {
      queryClient.clear();
      nextPageQuery = omit(router.query, PAGINATION_FIELDS);
    } else {
      const nextPageParams = { ...pageParams[page - 2] };
      nextPageQuery = { ...router.query };
      Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
    }
    router.query = nextPageQuery;
    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true })
      .then(() => {
        animateScroll.scrollToTop({ duration: 0 });
        setPage(prev => prev - 1);
      });
  }, [ router, page, pageParams, queryClient ]);

  const resetPage = useCallback(() => {
    queryClient.clear();
    router.push({ pathname: router.pathname, query: omit(router.query, PAGINATION_FIELDS) }, undefined, { shallow: true }).then(() => {
      animateScroll.scrollToTop({ duration: 0 });
      setPage(1);
      setPageParams([ {} ]);
    });
  }, [ router, queryClient ]);

  const hasPaginationParams = Object.keys(currPageParams).length > 0;

  const pagination = {
    page,
    onNextPageClick,
    onPrevPageClick,
    hasPaginationParams,
    resetPage,
  };

  return { data, isError, isLoading, pagination };
}
