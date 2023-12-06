import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import delay from 'lib/delay';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { TX, TX_ZKEVM_L2 } from 'stubs/tx';

interface Params {
  onTxStatusUpdate?: () => void;
  updateDelay?: number;
}

type ReturnType = UseQueryResult<Transaction, ResourceError<{ status: number }>> & {
  socketStatus: 'close' | 'error' | undefined;
}

export default function useFetchTxInfo({ onTxStatusUpdate, updateDelay }: Params | undefined = {}): ReturnType {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ socketStatus, setSocketStatus ] = React.useState<'close' | 'error'>();
  const hash = getQueryParamString(router.query.hash);

  const queryResult = useApiQuery<'tx', { status: number }>('tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      refetchOnMount: false,
      placeholderData: config.features.zkEvmRollup.isEnabled ? TX_ZKEVM_L2 : TX,
    },
  });
  const { data, isError, isPending } = queryResult;

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    updateDelay && await delay(updateDelay);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('tx', { pathParams: { hash } }),
    });
    onTxStatusUpdate?.();
  }, [ onTxStatusUpdate, queryClient, hash, updateDelay ]);

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
    isDisabled: isPending || isError || data.status !== null,
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
