import React from 'react';

import useFetch from 'lib/hooks/useFetch';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

export interface Params {
  url?: string;
  queryParams?: Record<string, string>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

const baseUrl = `https://bss-tg.ylide.io`;

export default function useTelegramApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<SuccessType = unknown, ErrorType = unknown>(
    { url, queryParams, fetchParams }: Params = {},
  ) => {
    return fetch<SuccessType, ErrorType>(
      `${ baseUrl }${ url }${ queryParams ? `?${ new URLSearchParams(queryParams || {}).toString() }` : '' }`,
      {
        ...fetchParams,
      },
    );
  }, [ fetch ]);
}
