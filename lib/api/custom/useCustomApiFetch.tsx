import _omit from 'lodash/omit';
import React from 'react';

import config from 'configs/app';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import type { ResourceName, ResourcePathParams } from './../resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<
    string,
    string | Array<string> | number | boolean | undefined
  >;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
}

export default function useCustomApiFetch() {
  const fetch = useFetch();

  return React.useCallback(
    <R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
      url: string,
      { fetchParams }: Params<R> = {},
    ) => {
      return fetch<SuccessType, ErrorType>(
        url,
        {
          credentials: config.features.account.isEnabled ?
            'include' :
            'same-origin',
          ..._omit(fetchParams, 'headers'),
        },
        {},
      );
    },
    [ fetch ],
  );
}
