import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { UserInfo, CustomAbis, PublicTags, AddressTags, TransactionTags, ApiKeys, WatchlistAddress } from 'types/api/account';
import type { BlocksResponse, BlockTransactionsResponse } from 'types/api/block';
import type { Stats, Charts } from 'types/api/stats';

import type { RESOURCES, ResourceError, ResourceName } from './resources';
import type { Params as ApiFetchParams } from './useApiFetch';
import useApiFetch from './useApiFetch';

export interface Params<R extends ResourceName> extends ApiFetchParams {
  queryOptions?: Omit<UseQueryOptions<unknown, ResourceError, ResourcePayload<R>>, 'queryKey' | 'queryFn'>;
}

export function getResourceKey<R extends ResourceName>(resource: R, { pathParams, queryParams }: Params<R> = {}) {
  if (pathParams || queryParams) {
    return [ resource, { ...pathParams, ...queryParams } ];
  }

  return [ resource ];
}

export default function useApiQuery<R extends ResourceName>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams }: Params<R> = {},
) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError, ResourcePayload<R>>(
    getResourceKey(resource, { pathParams, queryParams }),
    async() => {
      return apiFetch<R, ResourcePayload<R>, ResourceError>(resource, { pathParams, queryParams, fetchParams });
    }, queryOptions);
}

export type ResourcePayload<Q extends keyof typeof RESOURCES> =
  Q extends 'user_info' ? UserInfo :
    Q extends 'custom_abi' ? CustomAbis :
      Q extends 'public_tags' ? PublicTags :
        Q extends 'private_tags_address' ? AddressTags :
          Q extends 'private_tags_tx' ? TransactionTags :
            Q extends 'api_keys' ? ApiKeys :
              Q extends 'watchlist' ? Array<WatchlistAddress> :
                Q extends 'stats_counters' ? Stats :
                  Q extends 'stats_charts' ? Charts :
                    Q extends 'blocks' ? BlocksResponse :
                      Q extends 'block_txs' ? BlockTransactionsResponse :
                        never;
