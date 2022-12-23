import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Transaction } from 'types/api/transaction';
import { QueryKeys } from 'types/client/queries';

import delay from 'lib/delay';
import type { ErrorType } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

interface Params {
  onTxStatusUpdate?: () => void;
  updateDelay?: number;
}

type ReturnType = UseQueryResult<Transaction, ErrorType<{ status: number }>> & {
  socketStatus: 'close' | 'error' | undefined;
}

export default function useFetchTxInfo({ onTxStatusUpdate, updateDelay }: Params | undefined = {}): ReturnType {
  const router = useRouter();
  const fetch = useFetch();
  const queryClient = useQueryClient();
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();

  const queryResult = useQuery<unknown, ErrorType<{ status: number }>, Transaction>(
    [ QueryKeys.tx, router.query.id ],
    async() => await fetch(`/node-api/transactions/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
      refetchOnMount: false,
    },
  );
  const { data, isError, isLoading } = queryResult;

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    updateDelay && await delay(updateDelay);
    queryClient.invalidateQueries({ queryKey: [ QueryKeys.tx, router.query.id ] });
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
