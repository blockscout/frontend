import _pickBy from 'lodash/pickBy';
import React from 'react';

import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

export interface Params {
  url?: string;
  queryParams?: Record<string, string> | Array<Array<string>>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

const baseUrl = `https://blockscout-feed1.ylide.io`;

export default function useForumApiFetch(tokens?: string | Array<string>) {
  const fetch = useFetch();

  return React.useCallback(<SuccessType = unknown, ErrorType = unknown>(
    { url, queryParams, fetchParams }: Params = {},
  ) => {
    const headers = _pickBy({
      Authorization: tokens ? `Bearer ${ typeof tokens === 'string' ? tokens : tokens.join(' ') }` : undefined,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      `${ baseUrl }${ url }?${ new URLSearchParams(queryParams || {}).toString() }`,
      {
        headers,
        ...fetchParams,
      },
    );
  }, [ fetch, tokens ]);
}
