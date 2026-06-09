// SPDX-License-Identifier: LicenseRef-Blockscout

import { QueryClient } from '@tanstack/react-query';
import React from 'react';

import getErrorObjPayload from 'src/shared/errors/get-error-obj-payload';
import getErrorObjStatusCode from 'src/shared/errors/get-error-obj-status-code';

import type { ResourceName } from '../resources';

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

          const EXTERNAL_API_RESOURCES: Array<ResourceName> = [
            'core:contract_solidity_scan_report',
            'core:address_xstar_score',
            'core:address_3rd_party_info',
            'core:noves_transaction',
            'core:noves_address_history',
            'core:noves_describe_txs',
            // these resources are not proxied by the backend
            'external:safe_transaction_api',
          ];
          const isExternalApiResource = EXTERNAL_API_RESOURCES.some((resource) => query.queryKey[0] === resource);

          return !isExternalApiResource;
        },
      },
    },
  }));

  return queryClient;
}
