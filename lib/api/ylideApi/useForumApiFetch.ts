import _pickBy from 'lodash/pickBy';
import React from 'react';

import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

export interface Params {
  url?: string;
  queryParams?: Record<string, string> | Array<Array<string>>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
  tokens?: string | Array<string>;
}

const baseUrl = `https://blockscout-feed1.ylide.io`;

const mergeTokens = (tokens?: string | Array<string>, overrideTokens?: string | Array<string>) => {
  const firstTokens = typeof tokens === 'string' ? [ tokens ] : tokens || [];
  const secondTokens = typeof overrideTokens === 'string' ? [ overrideTokens ] : overrideTokens || [];
  return [ ...new Set(firstTokens.concat(secondTokens)).values() ];
};

export default function useForumApiFetch(tokens?: string | Array<string>) {
  const fetch = useFetch();

  return React.useCallback(<SuccessType = unknown, ErrorType = unknown>(
    { url, queryParams, fetchParams, tokens: overrideTokens }: Params = {},
  ) => {
    const mergedTokens = mergeTokens(tokens, overrideTokens);
    const headers = _pickBy({
      Authorization: mergedTokens ? `Bearer ${ typeof mergedTokens === 'string' ? mergedTokens : mergedTokens.join(' ') }` : undefined,
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
