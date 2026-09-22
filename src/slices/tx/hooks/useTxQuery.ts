// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import type { Chain, GetBlockReturnType, GetTransactionReturnType, TransactionReceipt } from 'viem';

import type { schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import { retry } from 'src/api/hooks/useQueryClientConfig';
import type { ResourceError } from 'src/api/resources';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { GET_BLOCK } from 'src/slices/block/stubs/rpc';
import { GET_TRANSACTION, GET_TRANSACTION_CONFIRMATIONS, GET_TRANSACTION_RECEIPT } from 'src/slices/tx/stubs/rpc';
import { TX } from 'src/slices/tx/stubs/tx';
import { formatTxDetailsRpcData } from 'src/slices/tx/utils/format-rpc-data';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import getQueryParamString from 'src/shared/router/get-query-param-string';
import delay from 'src/shared/utils/delay';

import { SECOND } from 'src/toolkit/utils/consts';

type RpcResponseType = [
  GetTransactionReturnType<Chain, 'latest'>,
  TransactionReceipt | null,
  bigint | null,
  GetBlockReturnType<Chain, false, 'latest'> | null,
];

type TxError = ResourceError<{ status: number }>;

export type TxQuery = UseQueryResult<schemas['TransactionResponse'], TxError> & {
  socketStatus: 'close' | 'error' | undefined;
  isDegradedData: boolean;
  apiError: TxError | null;
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

  const apiQuery = useApiQuery<'core:tx', { status: number }>('core:tx', {
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
  const { data, isError, isPlaceholderData, isPending, errorUpdateCount } = apiQuery;

  // a poll of a failed query clears its error while in flight (the placeholder shows meanwhile);
  // the last verdict must outlive that window
  const [ apiError, setApiError ] = React.useState<TxError | null>(null);
  if (!isPending && !isPlaceholderData && apiQuery.error !== apiError) {
    setApiError(apiQuery.error);
  }

  // the API could not serve the transaction (anything but a malformed hash), so the RPC node is asked instead;
  // a 404 is included on purpose: a slow indexer may not have caught a fresh transaction yet
  const isRpcFallbackNeeded = isPublicClientAvailable && ((isError && apiQuery.error.status !== 422) || isPlaceholderData) && errorUpdateCount > 0;

  const rpcQuery = useQuery<RpcResponseType, unknown, schemas['TransactionResponse'] | null>({
    queryKey: [ 'RPC', 'tx', { hash } ],
    queryFn: async() => {
      const publicClient = await getPublicClient();
      // Stryker disable next-line ConditionalExpression: undefined only without an RPC URL, which `enabled` already rules out; the guard narrows the type
      if (!publicClient) {
        throw new Error('No public RPC client');
      }

      const tx = await publicClient.getTransaction({ hash: hash as `0x${ string }` });

      const txReceipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${ string }` }).catch(() => null);
      const block = await publicClient.getBlock({ blockHash: tx.blockHash }).catch(() => null);
      const latestBlock = await publicClient.getBlock().catch(() => null);
      const confirmations = latestBlock && block ? latestBlock.number - block.number + BigInt(1) : null;

      return [
        tx,
        txReceipt,
        confirmations,
        block,
      ];
    },
    select: (response) => {
      const [ tx, receipt, confirmations, block ] = response;

      return formatTxDetailsRpcData({ tx, receipt, confirmations, block });
    },
    placeholderData: [
      GET_TRANSACTION,
      GET_TRANSACTION_RECEIPT,
      GET_TRANSACTION_CONFIRMATIONS,
      GET_BLOCK,
    ],
    enabled: isRpcFallbackNeeded,
    retry: 2,
    retryDelay: 5 * SECOND,
  });

  const isDegradedData = isRpcFallbackNeeded && Boolean(rpcQuery.data);

  // the API is polled while the node serves the transaction, so the page recovers once the indexer catches up
  React.useEffect(() => {
    setRefetchEnabled(isDegradedData);
  }, [ isDegradedData ]);

  const handleStatusUpdateMessage: SocketMessage.TxStatusUpdate['handler'] = React.useCallback(async() => {
    await delay(5 * SECOND);
    queryClient.invalidateQueries({
      queryKey: getResourceKey('core:tx', { pathParams: { hash } }),
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

  return React.useMemo(() => {
    const query = isDegradedData ? rpcQuery as UseQueryResult<schemas['TransactionResponse'], TxError> : apiQuery;

    return {
      ...query,
      socketStatus,
      isDegradedData,
      apiError,
    };
  }, [ apiQuery, rpcQuery, isDegradedData, socketStatus, apiError ]);
}
