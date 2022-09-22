import * as Sentry from '@sentry/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { CsrfData } from 'types/client/account';

export interface ErrorType<T> {
  error?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

interface Params {
  method?: RequestInit['method'];
  body?: Record<string, unknown>;
  credentials?: RequestCredentials;
}

export default function useFetch() {
  const queryClient = useQueryClient();
  const { token } = queryClient.getQueryData<CsrfData>([ 'csrf' ]) || {};

  return React.useCallback(<Success, Error>(path: string, params?: Params): Promise<Success | ErrorType<Error>> => {
    const reqParams = {
      ...params,
      body: params?.method && ![ 'GET', 'HEAD' ].includes(params.method) ?
        JSON.stringify({ ...params?.body, _csrf_token: token }) :
        undefined,
    };

    return fetch(path, reqParams).then(response => {
      if (!response.ok) {
        return response.json().then(
          (jsonError) => Promise.reject({
            error: jsonError as Error,
            status: response.status,
            statusText: response.statusText,
          }),
          () => {
            const error = {
              status: response.status,
              statusText: response.statusText,
            };
            Sentry.captureException(new Error('Client fetch failed'), { extra: error, tags: { source: 'fetch' } });

            return Promise.reject(error);
          },
        );

      } else {
        return response.json() as Promise<Success>;
      }
    });
  }, [ token ]);
}
