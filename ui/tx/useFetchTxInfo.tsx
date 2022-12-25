import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Transaction } from 'types/api/transaction';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import delay from 'lib/delay';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

interface Params {
  onTxStatusUpdate?: () => void;
  updateDelay?: number;
}

type ReturnType = UseQueryResult<Transaction, unknown> & {
  socketStatus: 'close' | 'error' | undefined;
}

export default function useFetchTxInfo({ onTxStatusUpdate, updateDelay }: Params | undefined = {}): ReturnType {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();

  const queryResult = useApiQuery('tx', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: {
      enabled: Boolean(router.query.id),
      refetchOnMount: false,
    },
  });
  const { data, isError, isLoading } = queryResult;

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    updateDelay && await delay(updateDelay);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('tx', { pathParams: { id: router.query.id?.toString() } }),
    });
    onTxStatusUpdate?.();
  }, [ onTxStatusUpdate, queryClient, router.query.id, updateDelay ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketStatus('close');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketStatus('error');
  }, []);

  const channel = useSocketChannel({
    topic: `transactions:${ router.query.id }`,
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: isLoading || isError || data.status !== null,
  });
  useSocketMessage({
    channel,
    event: 'collated',
    handler: handleStatusUpdateMessage,
  });

  return {
    ...queryResult,
    socketStatus,
  };
}
