import * as Sentry from '@sentry/react';
import React from 'react';

import isBodyAllowed from 'lib/api/isBodyAllowed';
import type {
  ResourceError,
  ResourceName,
  ResourcePath,
} from 'lib/api/resources';
import { boolApiNames } from 'lib/api/resources';

export interface Params {
  method?: RequestInit['method'];
  headers?: RequestInit['headers'];
  signal?: RequestInit['signal'];
  body?: Record<string, unknown> | FormData;
  credentials?: RequestCredentials;
}

interface Meta {
  resource?: ResourcePath;
  omitSentryErrorLog?: boolean;
}

export default function useFetch() {
  return React.useCallback(
    <Success, Error>(
      path: string,
      params?: Params,
      meta?: Meta,
      resourceName?: ResourceName,
    ): Promise<Success | ResourceError<Error>> => {
      const _body = params?.body;
      const isFormData = _body instanceof FormData;
      const withBody = isBodyAllowed(params?.method);

      const body: FormData | string | undefined = (() => {
        if (!withBody) {
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
          ...(withBody && !isFormData ?
            { 'Content-type': 'application/json' } :
            undefined),
          ...params?.headers,
        },
      };

      return fetch(path, reqParams).then((response) => {
        if (!response.ok) {
          const error = {
            status: response.status,
            statusText: response.statusText,
          };

          if (!meta?.omitSentryErrorLog) {
            Sentry.captureException(new Error('Client fetch failed'), {
              tags: {
                source: 'fetch',
                'source.resource': meta?.resource,
                'status.code': error.status,
                'status.text': error.statusText,
              },
            });
          }

          return response.json().then(
            (jsonError) =>
              Promise.reject({
                payload: jsonError as Error,
                status: response.status,
                statusText: response.statusText,
              }),
            () => {
              return Promise.reject(error);
            },
          );
        } else {
          if (resourceName && boolApiNames.includes(resourceName)) {
            return new Promise((resolve, reject) => {
              response.json().then((res: any) => {
                if (res.code === '000') {
                  resolve(res.data);
                } else {
                  reject(new Error(res.message));
                }
              });
            });
          } else {
            return response.json() as Promise<Success>;
          }
        }
      });
    },
    [],
  );
}
