// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType } from 'viem';

import type { Block } from 'client/slices/block/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';
import { retry } from 'client/api/hooks/useQueryClientConfig';
import type { ResourceError } from 'client/api/resources';

import { BLOCK } from 'client/slices/block/stubs/block';
import formatRpcData from 'client/slices/block/utils/format-rpc-data';

import { publicClient } from 'client/features/connect-wallet/utils/public-client';

import { GET_BLOCK } from 'stubs/RPC';
import { SECOND } from 'toolkit/utils/consts';

type RpcResponseType = GetBlockReturnType<Chain, false, 'latest'> | null;

export type BlockQuery = UseQueryResult<Block, ResourceError<{ status: number }>> & {
  isDegradedData: boolean;
  isFutureBlock: boolean;
};

interface Params {
  heightOrHash: string;
}

export default function useBlockQuery({ heightOrHash }: Params): BlockQuery {
  const [ isRefetchEnabled, setRefetchEnabled ] = React.useState(false);

  const apiQuery = useApiQuery<'general:block', { status: number }>('general:block', {
    pathParams: { height_or_hash: heightOrHash },
    queryOptions: {
      enabled: Boolean(heightOrHash),
      placeholderData: BLOCK,
      refetchOnMount: false,
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

  const latestBlockQuery = useQuery({
    queryKey: [ 'RPC', 'block', 'latest' ],
    queryFn: async() => {
      if (!publicClient) {
        return null;
      }
      return publicClient.getBlock({ blockTag: 'latest' });
    },
    enabled: publicClient !== undefined && (apiQuery.isError || apiQuery.errorUpdateCount > 0),
  });

  const rpcQuery = useQuery<RpcResponseType, unknown, Block | null>({
    queryKey: [ 'RPC', 'block', { heightOrHash } ],
    queryFn: async() => {
      if (!publicClient) {
        return null;
      }

      const blockParams = heightOrHash.startsWith('0x') ? { blockHash: heightOrHash as `0x${ string }` } : { blockNumber: BigInt(heightOrHash) };
      return publicClient.getBlock(blockParams).catch(() => null);
    },
    select: (block) => {
      return formatRpcData(block);
    },
    placeholderData: GET_BLOCK,
    enabled: !latestBlockQuery.isPending,
    retry: false,
    refetchOnMount: false,
  });

  React.useEffect(() => {
    if (apiQuery.isPlaceholderData || !publicClient) {
      return;
    }

    if (apiQuery.isError && apiQuery.errorUpdateCount === 1) {
      setRefetchEnabled(true);
    } else if (!apiQuery.isError) {
      setRefetchEnabled(false);
    }
  }, [ apiQuery.errorUpdateCount, apiQuery.isError, apiQuery.isPlaceholderData ]);

  React.useEffect(() => {
    if (!rpcQuery.isPlaceholderData && !rpcQuery.data) {
      setRefetchEnabled(false);
    }
  }, [ rpcQuery.data, rpcQuery.isPlaceholderData ]);

  const isRpcQuery = Boolean(publicClient && (apiQuery.isError || apiQuery.isPlaceholderData) && apiQuery.errorUpdateCount > 0 && rpcQuery.data);
  const query = isRpcQuery ? rpcQuery as UseQueryResult<Block, ResourceError<{ status: number }>> : apiQuery;

  return {
    ...query,
    isDegradedData: isRpcQuery,
    isFutureBlock: Boolean(
      !heightOrHash.startsWith('0x') &&
      latestBlockQuery.data && Number(latestBlockQuery.data.number) < Number(heightOrHash),
    ),
  };
}
