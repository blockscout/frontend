import React from 'react';

import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import { algoliaIndex } from './buildUniversalProfileUrl';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useUniversalProfileApiFetch() {
  const fetch = useFetch();

  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>({ queryParams }: Params<R> = {},
  ) => {
    const index = algoliaIndex;

    return fetch<SuccessType, ErrorType>(
      url,
    );
  }, [ fetch ]);
}
