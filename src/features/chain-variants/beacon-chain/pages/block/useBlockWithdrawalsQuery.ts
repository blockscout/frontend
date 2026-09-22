// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { hashKey, useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType } from 'viem';

import type { operations } from '@blockscout/api-types';

import { retry } from 'src/api/hooks/useQueryClientConfig';
import type { ResourceError } from 'src/api/resources';

import { toAddressModel } from 'src/slices/address/utils/model';
import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';
import { GET_BLOCK } from 'src/slices/block/stubs/rpc';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import config from 'src/config';
import hexToDecimal from 'src/shared/data/transformers/hex-to-decimal';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub, emptyPagination } from 'src/shared/pagination/utils';

import { SECOND } from 'src/toolkit/utils/consts';

import { WITHDRAWAL } from '../../stubs/withdrawals';

type RpcResponseType = GetBlockReturnType<Chain, false, 'latest'> | null;

export type BlockWithdrawalsQuery = ApiPaginatedQueryResult<'core:block_withdrawals'> & {
  isDegradedData: boolean;
};

interface Params {
  heightOrHash: string;
  blockQuery: BlockQuery;
  tab: string;
}

export default function useBlockWithdrawalsQuery({ heightOrHash, blockQuery, tab }: Params): BlockWithdrawalsQuery {
  const [ isRefetchEnabled, setRefetchEnabled ] = React.useState(false);

  const apiQuery = useApiPaginatedQuery({
    resourceName: 'core:block_withdrawals',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled:
        tab === 'withdrawals' &&
        config.features.beaconChain.isEnabled &&
        !blockQuery.isPlaceholderData && !blockQuery.isDegradedData,
      placeholderData: generateListStub<'core:block_withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
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

  const rpcQueryKey = [ 'RPC', 'block', { heightOrHash } ];
  const rpcQuery = useQuery<RpcResponseType, unknown, operations['BlockController.withdrawals']['json'] | null>({
    queryKey: rpcQueryKey,
    queryFn: async() => {
      const publicClient = await getPublicClient();
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
        items: block.withdrawals
          ?.map((withdrawal) => {
            return {
              amount: hexToDecimal(withdrawal.amount).toString(),
              index: hexToDecimal(withdrawal.index),
              validator_index: hexToDecimal(withdrawal.validatorIndex),
              receiver: toAddressModel({ hash: withdrawal.address }),
            };
          })
          .sort((a, b) => b.index - a.index) ?? [],
        next_page_params: null,
      };
    },
    placeholderData: GET_BLOCK,
    enabled:
      isPublicClientAvailable &&
      tab === 'withdrawals' &&
      config.features.beaconChain.isEnabled &&
      (blockQuery.isDegradedData || apiQuery.isError || apiQuery.errorUpdateCount > 0),
    retry: false,
    refetchOnMount: false,
  });

  React.useEffect(() => {
    if (apiQuery.isPlaceholderData || !isPublicClientAvailable) {
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

  const isRpcQuery = Boolean((
    blockQuery.isDegradedData ||
    ((apiQuery.isError || apiQuery.isPlaceholderData) && apiQuery.errorUpdateCount > 0)
  ) && rpcQuery.data && isPublicClientAvailable);

  const rpcPaginatedQuery: ApiPaginatedQueryResult<'core:block_withdrawals'> = {
    ...rpcQuery as UseQueryResult<operations['BlockController.withdrawals']['json'], ResourceError>,
    pagination: emptyPagination,
    onFilterChange: () => {},
    onSortingChange: () => {},
    filters: apiQuery.filters,
    sorting: apiQuery.sorting,
    queryHash: hashKey(rpcQueryKey),
    isInitialLoading: rpcQuery.isPlaceholderData,
    isTransitioning: false,
  };

  const query = isRpcQuery ? rpcPaginatedQuery : apiQuery;

  return {
    ...query,
    isDegradedData: isRpcQuery,
  };
}
