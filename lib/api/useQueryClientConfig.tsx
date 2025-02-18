import { QueryClient } from '@tanstack/react-query';
import React from 'react';

import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';

export const retry = (failureCount: number, error: unknown) => {
  const errorPayload = getErrorObjPayload<{ status: number }>(error);
  const status = errorPayload?.status || getErrorObjStatusCode(error);
  if (status && status >= 400 && status < 500) {
    // don't do retry for client error responses
    return false;
  }
  return failureCount < 2;
};

export default function useQueryClientConfig() {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry,
        throwOnError: (error, query) => {
          const status = getErrorObjStatusCode(error);

          // we don't catch error only for "Too many requests" response
          if (status !== 429) {
            return false;
          }

          const EXTERNAL_API_RESOURCES = [
            'safe_transaction_api',
            'contract_solidity_scan_report',
            'address_xstar_score',
            'noves_transaction',
            'noves_address_history',
            'noves_describe_txs',
            'gas_hawk_saving_potential',
          ];
          const isExternalApiResource = EXTERNAL_API_RESOURCES.some((resource) => query.queryKey[0] === resource);

          return !isExternalApiResource;
        },
      },
    },
  }));

  return queryClient;
}
