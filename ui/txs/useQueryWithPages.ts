import { useQuery } from '@tanstack/react-query';
import { pick, omit } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { animateScroll } from 'react-scroll';

import type { TransactionsResponse } from 'types/api/transaction';

import useFetch from 'lib/hooks/useFetch';

const PAGINATION_FIELDS = [ 'block_number', 'index', 'items_count' ];

export default function useQueryWithPages(queryName: string, filter: string) {
  const router = useRouter();
  const [ page, setPage ] = React.useState(1);
  const [ pageParams, setPageParams ] = React.useState<Array<Partial<TransactionsResponse['next_page_params']>>>([ {} ]);
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, TransactionsResponse>(
    [ queryName, { page } ],
    async() => {
      const params: Array<string> = [];

      Object.entries(pageParams[page - 1]).forEach(([ key, val ]) => params.push(`${ key }=${ val }`));

      return fetch(`/api/transactions?filter=${ filter }${ params.length ? '&' + params.join('&') : '' }`);
    },
    { staleTime: Infinity },
  );

  const onNextPageClick = useCallback(() => {
    if (page >= pageParams.length && data?.next_page_params) {
      // api adds filters into next-page-params now
      // later filters will be removed from response
      const nextPageParams = pick(data.next_page_params, PAGINATION_FIELDS);
      setPageParams(prev => [ ...prev, nextPageParams ]);
      const nextPageQuery = { ...router.query };
      Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
      router.query = nextPageQuery;
      router.push(router);
    }
    animateScroll.scrollToTop({ duration: 0 });
    setPage(prev => prev + 1);
  }, [ data, page, pageParams, router ]);

  const onPrevPageClick = useCallback(() => {
    // returning to the first page
    // we dont have pagination params for the first page
    if (page === 2) {
      router.query = omit(router.query, PAGINATION_FIELDS);
    } else {
      const nextPageParams = { ...pageParams[page - 1] };
      const nextPageQuery = { ...router.query };
      Object.entries(nextPageParams).forEach(([ key, val ]) => nextPageQuery[key] = val.toString());
      router.query = nextPageQuery;
    }
    router.push(router);
    animateScroll.scrollToTop({ duration: 0 });
    setPage(prev => prev - 1);
  }, [ router, page, pageParams ]);

  const resetPage = useCallback(() => {
    router.query = omit(router.query, PAGINATION_FIELDS);
    router.push(router);
    animateScroll.scrollToTop({ duration: 0 });
    setPageParams([ {} ]);
    setPage(1);
  }, [ router ]);

  // if there are pagination params on the initial page, we shouldn't show pagination
  const hasPagination = !(page === 1 && Object.keys(pick(router.query, PAGINATION_FIELDS)).length > 0);

  return { data, isError, isLoading, page, onNextPageClick, onPrevPageClick, hasPagination, resetPage };
}
