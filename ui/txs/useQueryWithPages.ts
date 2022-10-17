import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { TransactionsResponse } from 'types/api/transaction';

import useFetch from 'lib/hooks/useFetch';

export default function useQueryWithPages(queryName: string) {
  const [ page, setPage ] = React.useState(1);
  const [ pageParams, setPageParams ] = React.useState<Array<Partial<TransactionsResponse['next_page_params']>>>([ {} ]);
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, TransactionsResponse>(
    [ queryName, page ],
    async() => {
      const params: Array<string> = [];

      Object.entries(pageParams[page - 1]).forEach(([ key, val ]) => params.push(`${ key }=${ val }`));

      return fetch(`/api/transactions?filter=validated${ params.length ? '&' + params.join('&') : '' }`);
    },
  );

  const onNextPageClick = useCallback(() => {
    if (page >= pageParams.length && data?.next_page_params) {
      setPageParams(prev => [ ...prev, data?.next_page_params ]);
    }
    setPage(prev => prev + 1);
  }, [ data, page, pageParams ]);

  const onPrevPageClick = useCallback(() => {
    setPage(prev => prev - 1);
  }, []);

  return { data, isError, isLoading, page, onNextPageClick, onPrevPageClick };
}
