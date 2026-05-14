// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';
import type { Transaction } from 'client/slices/tx/types/api';

import useApiQuery, { getResourceKey } from 'client/api/hooks/useApiQuery';
import { retry } from 'client/api/hooks/useQueryClientConfig';
import type { ResourceError } from 'client/api/resources';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import { TX } from 'client/slices/tx/stubs/tx';

import getQueryParamString from 'client/shared/router/get-query-param-string';
import delay from 'client/shared/utils/delay';

import { SECOND } from 'toolkit/utils/consts';

export type TxQuery = UseQueryResult<Transaction, ResourceError<{ status: number }>> & {
  socketStatus: 'close' | 'error' | undefined;
  setRefetchEnabled: (value: boolean) => void;
};

interface Params {
  hash?: string;
  isEnabled?: boolean;
}

export default function useTxQuery(params?: Params): TxQuery {
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();
  const [ isRefetchEnabled, setRefetchEnabled ] = React.useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const hash = params?.hash ?? getQueryParamString(router.query.hash);

  const queryResult = useApiQuery<'general:tx', { status: number }>('general:tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && params?.isEnabled !== false,
      refetchOnMount: false,
      placeholderData: TX,
      retry: (failureCount, error) => {
        if (isRefetchEnabled) {
          return false;
        }

        return retry(failureCount, error);
      },
      refetchInterval: (): number | false => {
        return isRefetchEnabled ? 15 * SECOND : false;
      },
    },
  });
  const { data, isError, isPlaceholderData, isPending } = queryResult;

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    await delay(5 * SECOND);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('general:tx', { pathParams: { hash } }),
    });
  }, [ queryClient, hash ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketStatus('close');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketStatus('error');
  }, []);

  const channel = useSocketChannel({
    topic: `transactions:${ hash }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: isPending || isPlaceholderData || isError || data.status !== null,
  });
  useSocketMessage({
    channel,
    event: 'collated',
    handler: handleStatusUpdateMessage,
  });

  return React.useMemo(() => ({
    ...queryResult,
    socketStatus,
    setRefetchEnabled,
  }), [ queryResult, socketStatus, setRefetchEnabled ]);
}
