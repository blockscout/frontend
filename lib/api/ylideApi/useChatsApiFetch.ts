// const { entries: enteriesRaw } = await indexerRequest<{
// 	totalCount: number
// 	entries: { type: 'message' | string; id: string; isIncoming: boolean; msg: IMessage }[]
//   }>(CHAT_ENDPOINT, {
// 	myAddress: account,
// 	recipientAddress: recipientAddress || recipientName,
// 	offset: 0,
// 	limit: 1000,
//   })

import _pickBy from 'lodash/pickBy';
import React from 'react';

import useFetch from 'lib/hooks/useFetch';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

export interface Params {
  url?: string;
  queryParams?: Record<string, string>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

const baseUrl = `https://idx1.ylide.io`;

export default function useChatsApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<SuccessType = unknown, ErrorType = unknown>(
    { url, queryParams, fetchParams }: Params = {},
  ) => {
    const headers = _pickBy({
      'Content-type': fetchParams?.body ? 'text/plain' : undefined,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      `${ baseUrl }${ url }?${ new URLSearchParams(queryParams || {}).toString() }`,
      {
        headers,
        ...fetchParams,
      },
    );
  }, [ fetch ]);
}
