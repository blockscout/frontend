import * as Sentry from '@sentry/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { CsrfData } from 'types/client/account';

import type { ResourceError, ResourcePath } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';

export interface Params {
  method?: RequestInit['method'];
  headers?: RequestInit['headers'];
  signal?: RequestInit['signal'];
  body?: Record<string, unknown> | FormData;
  credentials?: RequestCredentials;
}

interface Meta {
  resource?: ResourcePath;
}

export default function useFetch() {
  const queryClient = useQueryClient();
  const { token } = queryClient.getQueryData<CsrfData>(getResourceKey('csrf')) || {};

  return React.useCallback(<Success, Error>(path: string, params?: Params, meta?: Meta): Promise<Success | ResourceError<Error>> => {
    const _body = params?.body;
    const isFormData = _body instanceof FormData;
    const isBodyAllowed = params?.method && ![ 'GET', 'HEAD' ].includes(params.method);

    const body: FormData | string | undefined = (() => {
      if (!isBodyAllowed) {
        return;
      }

      if (isFormData) {
        return _body;
      }

      return JSON.stringify(_body);
    })();

    const reqParams = {
      ...params,
      body,
      headers: {
        ...(isBodyAllowed && !isFormData ? { 'Content-type': 'application/json' } : undefined),
        ...(isBodyAllowed && token ? { 'x-csrf-token': token } : undefined),
        ...params?.headers,
      },
    };

    return fetch(path, reqParams).then(response => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
        };
        Sentry.captureException(new Error('Client fetch failed'), { extra: { ...error, ...meta }, tags: { source: 'api_fetch' } });

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
