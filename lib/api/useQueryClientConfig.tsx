import { QueryClient } from '@tanstack/react-query';
import React from 'react';

import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';

export default function useQueryClientConfig() {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const errorPayload = getErrorObjPayload<{ status: number }>(error);
          const status = errorPayload?.status || getErrorObjStatusCode(error);
          if (status && status >= 400 && status < 500) {
            // don't do retry for client error responses
            return false;
          }
          return failureCount < 2;
        },
        throwOnError: (error) => {
          const status = getErrorObjStatusCode(error);
          // don't catch error for "Too many requests" response
          return status === 429;
        },
      },
    },
  }));

  return queryClient;
}
