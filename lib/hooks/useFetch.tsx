import * as Sentry from '@sentry/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { CsrfData } from 'types/client/account';

import type { ResourceError } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';

export interface Params {
  method?: RequestInit['method'];
  headers?: RequestInit['headers'];
  signal?: RequestInit['signal'];
  body?: Record<string, unknown>;
  credentials?: RequestCredentials;
}

export default function useFetch() {
  const queryClient = useQueryClient();
  const { token } = queryClient.getQueryData<CsrfData>(getResourceKey('csrf')) || {};

  return React.useCallback(<Success, Error>(path: string, params?: Params): Promise<Success | ResourceError<Error>> => {
    const hasBody = params?.method && params?.body && ![ 'GET', 'HEAD' ].includes(params.method);

    const reqParams = {
      ...params,
      body: hasBody ? JSON.stringify({ ...params.body, _csrf_token: token }) : undefined,
      headers: {
        ...(hasBody ? { 'Content-type': 'application/json' } : undefined),
        ...params?.headers,
        // ...(token ? { 'x-csrf-token': token } : {}),
      },
    };

    return fetch(path, reqParams).then(response => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
        };
        Sentry.captureException(new Error('Client fetch failed'), { extra: error, tags: { source: 'fetch' } });

        return response.json().then(
          (jsonError) => Promise.reject({
            payload: jsonError as Error,
            status: response.status,
            statusText: response.statusText,
          }),
          () => {
            return Promise.reject(error);
          },
        );

      } else {
        return response.json() as Promise<Success>;
      }
    });
  }, [ token ]);
}
