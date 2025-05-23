import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType } from 'viem';

import type { Block } from 'types/api/block';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { retry } from 'lib/api/useQueryClientConfig';
import dayjs from 'lib/date/dayjs';
import { publicClient } from 'lib/web3/client';
import { BLOCK } from 'stubs/block';
import { GET_BLOCK } from 'stubs/RPC';
import { SECOND } from 'toolkit/utils/consts';
import { unknownAddress } from 'ui/shared/address/utils';

type RpcResponseType = GetBlockReturnType<Chain, false, 'latest'> | null;

export type BlockQuery = UseQueryResult<Block, ResourceError<{ status: number }>> & {
  isDegradedData: boolean;
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
      if (!block) {
        return null;
      }

      return {
        height: Number(block.number),
        timestamp: dayjs.unix(Number(block.timestamp)).format(),
        transactions_count: block.transactions.length,
        internal_transactions_count: 0,
        miner: { ...unknownAddress, hash: block.miner },
        size: Number(block.size),
        hash: block.hash,
        parent_hash: block.parentHash,
        difficulty: block.difficulty.toString(),
        total_difficulty: block.totalDifficulty?.toString() ?? null,
        gas_used: block.gasUsed.toString(),
        gas_limit: block.gasLimit.toString(),
        nonce: block.nonce,
        base_fee_per_gas: block.baseFeePerGas?.toString() ?? null,
        burnt_fees: null,
        priority_fee: null,
        extra_data: block.extraData,
        state_root: block.stateRoot,
        gas_target_percentage: null,
        gas_used_percentage: null,
        burnt_fees_percentage: null,
        type: 'block', // we can't get this type from RPC, so it will always be a regular block
        transaction_fees: null,
        uncles_hashes: block.uncles,
        withdrawals_count: block.withdrawals?.length,
      };
    },
    placeholderData: GET_BLOCK,
    enabled: publicClient !== undefined && (apiQuery.isError || apiQuery.errorUpdateCount > 0),
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
  };
}
